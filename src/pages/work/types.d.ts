import type { SanityDocument } from "@sanity/client";

export interface Meta {
  title?: string;
  description?: string;
}

export interface ImageRow {
  _key: string;
  asset: {
    alt?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
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
