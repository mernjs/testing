/** A DNS record the domain owner must publish before the domain can serve. */
export interface DnsRecord {
  type: "A" | "CNAME" | "TXT";
  name: string;
  value: string;
  reason: string;
}

export interface DomainStatus {
  /** The host is attached to the hosting project. */
  attached: boolean;
  /** Ownership proven to the hosting provider (no TXT challenge outstanding). */
  verified: boolean;
  /** DNS points at the hosting provider, so traffic (and SSL issuance) works. */
  dnsConfigured: boolean;
  /** Records still needed, when not verified / not configured. */
  records: DnsRecord[];
}

export type DomainResult<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * Where a company's hostnames get attached for routing + TLS. Swappable at
 * the platform level (`DOMAIN_PROVIDER`), so moving hosting off Vercel means
 * one new adapter, not an application change.
 */
export interface DomainProvider {
  id: string;
  add(host: string): Promise<DomainResult<DomainStatus>>;
  status(host: string): Promise<DomainResult<DomainStatus>>;
  /** Asks the provider to re-check ownership now. */
  verify(host: string): Promise<DomainResult<DomainStatus>>;
  remove(host: string): Promise<DomainResult<null>>;
}
