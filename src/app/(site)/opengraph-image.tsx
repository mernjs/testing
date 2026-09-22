import { homeOgImageSize, renderHomeOgImage } from "./home-og-image";

export const alt = "YashOrbit — Custom Software & AI/ML, Built Around Your Business";
export const size = homeOgImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderHomeOgImage();
}
