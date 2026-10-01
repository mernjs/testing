import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import { companySiteUrl } from "@/lib/platform/tenancy/site-url";
import { getSiteInfo } from "@/lib/cms/site-info";
import { getMockupText, getProductsText, requireProduct } from "@/lib/products/server";
import { productJsonLd, productMetadata } from "@/lib/products/seo";
import { productHref } from "@/lib/products/shared";
import ProductDetailHero from "@/components/products/page/ProductDetailHero";
import {
  AiSection, AutomationSection, BenefitsSection, FaqSection, FeaturesSection, IntegrationsSection, ProblemSection,
  RelatedSection, TourSection, UseCasesSection, WhatItDoesSection, WhoForSection,
} from "@/components/products/page/ProductDetailSections";
import { ProductsCtaBand } from "@/components/products/page/ProductsSections";
import { fillText } from "@/lib/products/text";

/**
 * /products/<slug> — one long-form page per product. Owner's site only (a tenant host, or an unknown
 * slug, is a 404). Rendered per request like the CMS catch-all: the same path is a different site per host.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await requireProduct((await params).slug);
  const [text, { brand }, origin] = await Promise.all([getProductsText(), getSiteInfo(), companySiteUrl()]);
  return withSeoOverrides(productHref(product.slug), productMetadata(product, { origin, siteName: brand.namePrimary + brand.nameAccent, text }));
}

export default async function ProductPage({ params }: Props) {
  const { product, all } = await requireProduct((await params).slug);
  const [text, mockupText, { brand }, origin] = await Promise.all([getProductsText(), getMockupText(), getSiteInfo(), companySiteUrl()]);
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {productJsonLd(product, origin, brand.namePrimary + brand.nameAccent, text).map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <ProductDetailHero product={product} text={text} mockupText={mockupText} />
      <ProblemSection product={product} text={text} />
      <WhatItDoesSection product={product} text={text} />
      <FeaturesSection product={product} text={text} />
      <AiSection product={product} text={text} />
      <AutomationSection product={product} text={text} />
      <UseCasesSection product={product} text={text} />
      <BenefitsSection product={product} text={text} />
      <WhoForSection product={product} text={text} />
      <IntegrationsSection product={product} text={text} />
      <TourSection product={product} text={text} mockupText={mockupText} />
      <FaqSection product={product} text={text} />
      <RelatedSection product={product} all={all} text={text} />
      <ProductsCtaBand
        products={all}
        text={text}
        title={fillText(text["products.detail.cta.title"], { name: product.shortName || product.name })}
        description={text["products.detail.cta.description"]}
        defaultProduct={product.name}
        source={`product:${product.slug}`}
      />
    </div>
  );
}
