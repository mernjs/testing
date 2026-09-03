import crypto from "crypto";

export type IndexingNotificationType = "URL_UPDATED" | "URL_DELETED";

export interface IndexingResponse {
  success: boolean;
  url: string;
  type: IndexingNotificationType;
  message?: string;
  data?: unknown;
}

/**
 * Encodes a buffer or object to base64url format.
 */
function base64urlEncode(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Obtains an OAuth2 access token for Google Indexing API using a Service Account JWT.
 */
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedClaimSet = base64urlEncode(JSON.stringify(claimSet));
  const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  // Ensure formatted private key handles newline characters correctly
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
  const signature = signer.sign(formattedPrivateKey);
  const encodedSignature = base64urlEncode(signature);

  const jwt = `${unsignedToken}.${encodedSignature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain Google OAuth2 token: ${res.status} ${errText}`);
  }

  const tokenData = (await res.json()) as { access_token: string };
  return tokenData.access_token;
}

/**
 * Publishes a URL update or deletion notice to Google's Indexing API.
 */
export async function notifyGoogleIndexing(
  targetUrl: string,
  type: IndexingNotificationType = "URL_UPDATED"
): Promise<IndexingResponse> {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_INDEXING_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return {
      success: false,
      url: targetUrl,
      type,
      message: "Google Indexing API environment variables (GOOGLE_INDEXING_CLIENT_EMAIL / GOOGLE_INDEXING_PRIVATE_KEY) are not set.",
    };
  }

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey);

    const apiRes = await fetch("https://indexing.googleapis.com/v1/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url: targetUrl,
        type,
      }),
    });

    const resData = await apiRes.json();

    if (!apiRes.ok) {
      return {
        success: false,
        url: targetUrl,
        type,
        message: `Google Indexing API error (${apiRes.status})`,
        data: resData,
      };
    }

    return {
      success: true,
      url: targetUrl,
      type,
      message: "Successfully published notification to Google Indexing API.",
      data: resData,
    };
  } catch (err) {
    return {
      success: false,
      url: targetUrl,
      type,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
