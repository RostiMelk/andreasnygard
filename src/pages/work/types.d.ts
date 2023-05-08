import type { SanityDocument, SanityImageAssetDocument } from "@sanity/client";

export interface Meta {
  title?: string;
  description?: string;
  link?: string;
}

export interface ImageRow {
  _key: string;
  asset: SanityImageAssetDocument;
}

export interface ImageRows {
  _key: string;
  imageRow?: ImageRow[];
}

export interface WorkProps {
  work: SanityDocument & {
    title?: string;
    meta?: Meta[];
    imageRows?: ImageRows[];
  };
}
