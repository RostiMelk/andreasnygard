import type { SanityDocument, SanityImageAssetDocument } from "@sanity/client";

export interface WorkProps {
  work: SanityDocument & {
    title?: string;
    content?: {
      _key: string;
      _type: string;
      [key: string]: any;
    }[];
  };
}
