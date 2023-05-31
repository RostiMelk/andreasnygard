import type { SanityDocument, SanityImageAssetDocument } from "@sanity/client";

export interface Meta {
  title?: string;
  description?: string;
  link?: string;
}

export interface WorkProps {
  work: SanityDocument & {
    title?: string;
    meta?: Meta[];
    content?: {
      _key: string;
      _type: string;
      [key: string]: any;
    }[];
  };
}
