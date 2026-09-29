import "server-only";
import type { DomainProvider, DomainStatus } from "@/lib/platform/domains/types";
import { vercelConfigured, vercelDomainProvider } from "@/lib/platform/domains/vercel";

export type { DnsRecord, DomainStatus, DomainResult } from "@/lib/platform/domains/types";

/**
 * Manual adapter: nothing is attached automatically (local development, or
 * hosting without an API). Reports hosts as attached/verified so routing —
 * which is decided by `company_domains`, not by the provider — still works;
 * attaching them to the hosting project is then an operator task.
 */
const manualDomainProvider: DomainProvider = {
  id: "manual",
  add: async () => ({ ok: true, value: manualStatus }),
  status: async () => ({ ok: true, value: manualStatus }),
  verify: async () => ({ ok: true, value: manualStatus }),
  remove: async () => ({ ok: true, value: null }),
};
const manualStatus: DomainStatus = { attached: true, verified: true, dnsConfigured: true, records: [] };

const PROVIDERS: Record<string, DomainProvider> = { vercel: vercelDomainProvider, manual: manualDomainProvider };

/** `DOMAIN_PROVIDER` (`vercel` | `manual`); unset → Vercel when its credentials exist, else manual. */
export function activeDomainProvider(): DomainProvider {
  const configured = process.env.DOMAIN_PROVIDER?.trim().toLowerCase();
  if (configured) {
    const provider = PROVIDERS[configured];
    if (!provider) throw new Error(`Unknown DOMAIN_PROVIDER "${configured}" (expected one of: ${Object.keys(PROVIDERS).join(", ")})`);
    return provider;
  }
  return vercelConfigured() ? vercelDomainProvider : manualDomainProvider;
}
