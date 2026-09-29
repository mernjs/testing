import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { LinkedinIcon } from "@/components/icons/SocialIcons";
import type { SiteInfo } from "@/lib/cms/site-info-shared";
import type { PublicFooterColumn } from "@/lib/cms/footer";
import BrandMark from "@/components/BrandMark";

/**
 * "Compact" footer variant, selectable per theme in the CMS
 * (src/lib/cms/component-variants.ts). Same content sources as the default
 * `Footer` — the CMS footer columns (or their code-defined defaults) and
 * CMS Site Identity (brand, contact details) — in a different structure: no CTA band, one dense
 * row of link groups, a slim bottom bar.
 */
export default function FooterCompact({ cmsFooter, siteInfo }: { cmsFooter: PublicFooterColumn[]; siteInfo: SiteInfo }) {
  const { brand, contact, footer } = siteInfo;
  const columns = cmsFooter;

  return (
    <footer className="mt-auto border-t border-border/60 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs space-y-4">
            <Link href="/" className="flex w-fit items-center gap-2">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- CMS logo URL (any host)
                <img src={brand.logoUrl} alt="" className="size-7 object-contain" />
              ) : (
                <BrandMark className="size-7" />
              )}
              <span className="text-lg font-extrabold tracking-tight">
                {brand.namePrimary}<span className="text-primary">{brand.nameAccent}</span>
              </span>
            </Link>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="size-4" aria-hidden="true" /> {contact.email}
              </a>
              <a href={contact.phoneHref} className="flex items-center gap-2 hover:text-primary">
                <Phone className="size-4" aria-hidden="true" /> {contact.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4 lg:max-w-3xl">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">{column.title}</h3>
                <ul role="list" className="mt-3 space-y-2">
                  {column.links.slice(0, 6).map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className={`text-sm hover:text-primary ${link.emphasized ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {column.viewAllHref && (
                    <li>
                      <Link href={column.viewAllHref} className="text-sm font-semibold text-foreground hover:text-primary">
                        {column.viewAllLabel || `View all ${column.title}`}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {brand.namePrimary}{brand.nameAccent} {brand.subtitle}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {footer.compactLinks.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="hover:text-primary">{link.label}</Link>
            ))}
            <a href={contact.linkedinHref} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <span className="sr-only">LinkedIn</span>
              <LinkedinIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
