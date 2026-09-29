import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { WhatsAppIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { socialIconFor } from "@/components/icons/social-icon-for";
import type { SiteInfo } from "@/lib/cms/site-info-shared";
import type { PublicFooterColumn } from "@/lib/cms/footer";

export default function Footer({ cmsFooter, siteInfo }: { cmsFooter: PublicFooterColumn[]; siteInfo: SiteInfo }) {
  const { brand, contact, social, footer } = siteInfo;
  const footerColumns = cmsFooter;
  return (
    <footer className="relative bg-secondary dark:bg-[#1a1533] text-secondary-foreground border-t border-border mt-auto overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* CTA strip */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-16 sm:pt-20 group/cta">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/0 to-secondary/20 opacity-0 group-hover/cta:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-background/10 border border-secondary-foreground/15 dark:border-white/10 backdrop-blur-sm px-8 py-10 sm:px-12 transition-all duration-300 group-hover/cta:border-primary/30 group-hover/cta:-translate-y-1">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {footer.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{footer.ctaTitle}</h3>
            <p className="text-sm sm:text-base text-secondary-foreground/85 mt-2">{footer.ctaText}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <Link
              href={footer.ctaHref}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
            >
              {footer.ctaLabel} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-bold text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foreground/10"
            >
              <WhatsAppIcon className="w-4 h-4" />
              {footer.whatsappLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-20 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              {/* Dark mode swaps to the reversed, ice-globe variant for better contrast against
                  the footer's dark surface. See public/brand/icon-on-blue.svg. */}
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- CMS logo URL (any host)
                <img src={brand.logoUrl} alt="" className="w-9 h-9 shrink-0 object-contain" />
              ) : (
                <>
              <svg viewBox="0 0 64 64" className="w-9 h-9 shrink-0 dark:hidden" aria-hidden="true">
                <path d="M4,50 C0,60 40,38 50,26" fill="none" stroke="#ECF2FD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <circle cx="32" cy="32" r="25.5" fill="#1D428A" />
                <g fill="#ECF2FD" opacity="0.4">
                  <circle cx="29.4" cy="24.6" r="0.92" />
                  <circle cx="34.6" cy="24.6" r="0.92" />
                  <circle cx="26.8" cy="29.8" r="0.98" />
                  <circle cx="32.0" cy="29.8" r="1.09" />
                  <circle cx="37.2" cy="29.8" r="0.98" />
                  <circle cx="24.2" cy="35.0" r="0.9" />
                  <circle cx="29.4" cy="35.0" r="1.03" />
                  <circle cx="34.6" cy="35.0" r="1.03" />
                  <circle cx="39.8" cy="35.0" r="0.9" />
                  <circle cx="21.6" cy="19.4" r="0.75" />
                  <circle cx="32.0" cy="19.4" r="0.78" />
                  <circle cx="42.4" cy="19.4" r="0.75" />
                  <circle cx="19.0" cy="45.4" r="0.6" />
                  <circle cx="29.4" cy="45.4" r="0.75" />
                  <circle cx="34.6" cy="45.4" r="0.75" />
                  <circle cx="45.0" cy="45.4" r="0.6" />
                </g>
                <path d="M17.6,17.6 L32,33.6" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
                <path d="M32,33.6 L32,48" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
                <path d="M46.4,17.6 L36,29.2" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
                <circle cx="34.4" cy="30.4" r="4.8" fill="#E56043" />
                <path d="M8,44 C2,57 45,31 56,12" fill="none" stroke="#E56043" strokeWidth="3" strokeLinecap="round" />
                <polygon points="58.6,15.8 51.4,11.6 59.8,5.5" fill="#E56043" />
              </svg>
              <svg viewBox="0 0 64 64" className="hidden w-9 h-9 shrink-0 dark:block" aria-hidden="true">
                <path d="M4,50 C0,60 40,38 50,26" fill="none" stroke="#1D428A" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
                <circle cx="32" cy="32" r="25.5" fill="#ECF2FD" />
                <g fill="#1D428A" opacity="0.22">
                  <circle cx="29.4" cy="24.6" r="0.92" />
                  <circle cx="34.6" cy="24.6" r="0.92" />
                  <circle cx="26.8" cy="29.8" r="0.98" />
                  <circle cx="32.0" cy="29.8" r="1.09" />
                  <circle cx="37.2" cy="29.8" r="0.98" />
                  <circle cx="24.2" cy="35.0" r="0.9" />
                  <circle cx="29.4" cy="35.0" r="1.03" />
                  <circle cx="34.6" cy="35.0" r="1.03" />
                  <circle cx="39.8" cy="35.0" r="0.9" />
                  <circle cx="21.6" cy="19.4" r="0.75" />
                  <circle cx="32.0" cy="19.4" r="0.78" />
                  <circle cx="42.4" cy="19.4" r="0.75" />
                  <circle cx="19.0" cy="45.4" r="0.6" />
                  <circle cx="29.4" cy="45.4" r="0.75" />
                  <circle cx="34.6" cy="45.4" r="0.75" />
                  <circle cx="45.0" cy="45.4" r="0.6" />
                </g>
                <path d="M17.6,17.6 L32,33.6" fill="none" stroke="#1D428A" strokeWidth="8" strokeLinecap="round" />
                <path d="M32,33.6 L32,48" fill="none" stroke="#1D428A" strokeWidth="8" strokeLinecap="round" />
                <path d="M46.4,17.6 L36,29.2" fill="none" stroke="#1D428A" strokeWidth="8" strokeLinecap="round" />
                <circle cx="34.4" cy="30.4" r="4.8" fill="#E56043" />
                <path d="M8,44 C2,57 45,31 56,12" fill="none" stroke="#E56043" strokeWidth="3" strokeLinecap="round" />
                <polygon points="58.6,15.8 51.4,11.6 59.8,5.5" fill="#E56043" />
              </svg>
                </>
              )}
              <span className="flex flex-col leading-none">
                <span className="font-extrabold text-2xl tracking-tight">
                  <span className="text-secondary-foreground">{brand.namePrimary}</span><span className="text-primary">{brand.nameAccent}</span>
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary-foreground/85">
                  {brand.subtitle}
                </span>
              </span>
            </Link>
            <p className="text-sm leading-6 text-secondary-foreground/85 max-w-xs">
              {footer.about}
            </p>

            <div className="space-y-2.5">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 text-sm text-secondary-foreground/85 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 flex-none" aria-hidden="true" />
                {contact.email}
              </a>
              <a
                href={contact.phoneHref}
                className="flex items-center gap-2.5 text-sm text-secondary-foreground/85 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 flex-none" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground/85 mb-3">{footer.followLabel}</p>
              <div className="flex gap-3">
                {social.map((social) => {
                  const Icon = socialIconFor(social.name);
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-background/10 border border-secondary-foreground/15 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                    >
                      <span className="sr-only">{social.name}</span>
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
                <a
                href={contact.linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 border border-secondary-foreground/15 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <LinkedinIcon className="h-4 w-4" />
              </a>
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4 xl:col-span-2 xl:mt-0">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 uppercase tracking-wider text-[#b83e23] dark:text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  {column.title}
                </h3>
                <ul role="list" className="mt-6 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={
                          link.emphasized
                            ? "inline-block text-sm leading-6 text-primary font-semibold hover:translate-x-1 transition-all duration-200"
                            : "inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200"
                        }
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {column.viewAllHref && (
                    <li className="pt-1">
                      <Link href={column.viewAllHref} className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-secondary-foreground hover:text-primary transition-colors">
                        {column.viewAllLabel || `View All ${column.title}`}
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom bar (copyright + legal links) — hidden for now; remove `hidden` to show it again. */}
        <div className="hidden mt-16 border-t border-secondary-foreground/10 dark:border-white/10 sm:mt-20 lg:mt-24">
          <div className="mt-8 rounded-2xl bg-white/40 dark:bg-white/5 px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs leading-5 text-secondary-foreground/85">
              &copy; {new Date().getFullYear()} <span className="text-secondary-foreground">{brand.namePrimary}</span><span className="text-primary">{brand.nameAccent}</span> {footer.copyright}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-secondary-foreground/85">
              {footer.legalLinks.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
