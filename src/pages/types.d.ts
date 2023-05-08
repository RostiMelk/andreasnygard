import type { SanityImageAssetDocument } from "@sanity/client";

export interface WorkDocument {
  _key: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: SanityImageAssetDocument;
}

export interface HomeProps {
  work: WorkDocument[];
}
