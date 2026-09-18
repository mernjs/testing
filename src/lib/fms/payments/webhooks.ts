import "server-only";
import { getDb } from "@/lib/mongodb";
import { newId } from "@/lib/fms/db";
import { recordAudit } from "@/lib/fms/audit";
import { getPaymentProvider, PaymentProviderId } from "./provider";
import { getPaymentIntentByGatewayOrder, markPaymentIntentSuccessful, markPaymentIntentFailed } from "./intents";

export const WEBHOOK_EVENTS_COLLECTION = "fms_webhook_events";

export interface WebhookEventRecord {
  _id: string;
  providerEventId: string;
  provider: PaymentProviderId;
  eventType: string;
  payload: Record<string, unknown>;
  processedAt: Date;
  status: "PROCESSED" | "IGNORED" | "FAILED";
  error?: string;
}

let indexesEnsured = false;
async function getCollection() {
  const db = await getDb();
  const collection = db.collection<WebhookEventRecord>(WEBHOOK_EVENTS_COLLECTION);
  if (!indexesEnsured) {
    indexesEnsured = true;
    await Promise.all([
      collection.createIndex({ providerEventId: 1, provider: 1 }, { unique: true }).catch(() => {}),
      collection.createIndex({ processedAt: -1 }).catch(() => {}),
    ]);
  }
  return collection;
}

export async function processPaymentWebhook(
  providerId: PaymentProviderId,
  rawBody: string,
  signature: string
): Promise<{ ok: boolean; status: number; message: string }> {
  const provider = getPaymentProvider(providerId);

  const secret = process.env[`${providerId.toUpperCase()}_WEBHOOK_SECRET`] || process.env.RAZORPAY_KEY_SECRET || "default_secret";
  const isValid = provider.verifyWebhookSignature(rawBody, signature, secret);

  if (!isValid && providerId !== "mock") {
    return { ok: false, status: 400, message: "Invalid webhook signature" };
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return { ok: false, status: 400, message: "Invalid JSON payload" };
  }

  const providerEventId = (body.event_id || body.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`) as string;
  const eventType = (body.event || body.type || "payment.captured") as string;

  const collection = await getCollection();
  const existing = await collection.findOne({ providerEventId, provider: providerId });
  if (existing) {
    return { ok: true, status: 200, message: "Duplicate webhook event ignored" };
  }

  const logDoc: WebhookEventRecord = {
    _id: newId(),
    providerEventId,
    provider: providerId,
    eventType,
    payload: body,
    processedAt: new Date(),
    status: "PROCESSED",
  };

  try {
    if (providerId === "razorpay") {
      const payloadObj = body.payload as Record<string, any>;
      if (eventType === "payment.captured" || eventType === "order.paid") {
        const paymentEntity = payloadObj?.payment?.entity;
        const orderId = paymentEntity?.order_id || payloadObj?.order?.entity?.id;
        const paymentId = paymentEntity?.id;
        const utr = paymentEntity?.acquirer_data?.rrn || paymentEntity?.acquirer_data?.upi_transaction_id;

        if (orderId) {
          const intent = await getPaymentIntentByGatewayOrder(orderId);
          if (intent) {
            await markPaymentIntentSuccessful(intent._id, {
              gatewayPaymentId: paymentId,
              utr,
              paymentMethod: paymentEntity?.method?.toUpperCase() as any,
            });
          }
        }
      } else if (eventType === "payment.failed") {
        const paymentEntity = payloadObj?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        if (orderId) {
          const intent = await getPaymentIntentByGatewayOrder(orderId);
          if (intent) {
            await markPaymentIntentFailed(intent._id, paymentEntity?.error_description || "Razorpay Payment Failed");
          }
        }
      }
    } else if (providerId === "mock") {
      const intentId = body.intentId as string;
      const orderId = body.orderId as string;
      if (intentId) {
        await markPaymentIntentSuccessful(intentId, {
          gatewayPaymentId: `mock_pay_${Date.now()}`,
          utr: `UTR_MOCK_${Date.now()}`,
        });
      } else if (orderId) {
        const intent = await getPaymentIntentByGatewayOrder(orderId);
        if (intent) {
          await markPaymentIntentSuccessful(intent._id, {
            gatewayPaymentId: `mock_pay_${Date.now()}`,
            utr: `UTR_MOCK_${Date.now()}`,
          });
        }
      }
    }

    await collection.insertOne(logDoc);
    await recordAudit({
      actorId: "system",
      actorEmail: "webhook@yashorbit.com",
      action: "webhook_received",
      entity: "webhook_event",
      entityId: logDoc._id,
      entityLabel: providerEventId,
      summary: `Processed webhook event ${eventType} for ${providerId}`,
    });

    return { ok: true, status: 200, message: "Webhook processed successfully" };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logDoc.status = "FAILED";
    logDoc.error = errorMsg;
    await collection.insertOne(logDoc);
    return { ok: false, status: 500, message: `Webhook processing error: ${errorMsg}` };
  }
}
