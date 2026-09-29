import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import { SiteInfoProvider } from "@/components/cms/SiteInfoContext";
import { getSiteInfo } from "@/lib/cms/site-info";
import { siteUrl } from "@/lib/seo";
import { getSiteSeo, siteMetadata } from "@/lib/cms/site-seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Site-wide SEO defaults every page inherits — CMS → Settings (see lib/cms/site-seo.ts). */
export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata(await getSiteSeo(), {
    metadataBase: new URL(siteUrl),
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Brand, contact details and social links (CMS → Site Identity); site-wide structured data (CMS → Settings).
  const [siteInfo, { jsonLd }] = await Promise.all([getSiteInfo(), getSiteSeo()]);

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WZ456GGS');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WPFPFSCWXB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WPFPFSCWXB');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xxlaecvsng");
          `}
        </Script>

      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZ456GGS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {jsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteInfoProvider value={siteInfo}>
            {children}
            <FloatingContactButtons />
          </SiteInfoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
