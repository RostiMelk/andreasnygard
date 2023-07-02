import type { SanityImageAssetDocument } from "@sanity/client";

export interface BlogDocument {
  _id: string;
  title: string;
  image: SanityImageAssetDocument;
}

export interface BlogProps {
  blog: BlogDocument[];
}
