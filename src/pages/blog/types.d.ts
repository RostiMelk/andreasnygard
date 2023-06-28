import type { SanityImageAssetDocument } from "@sanity/client";

export interface BlogDocument {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage: SanityImageAssetDocument;
}

export interface BlogProps {
  blog: BlogDocument[];
}
