import type { SanityImageAssetDocument } from "@sanity/client";

export interface WorkDocument {
  _id: string;
  title: string;
  shortTitle?: string;
  notClickable?: boolean;
  slug: {
    current: string;
  };
  mainImage: SanityImageAssetDocument;
}

export interface HomeProps {
  homePage: {
    headerContinuation: {
      _key: string;
      _type: string;
      [key: string]: any;
    }[];
  };
  work: WorkDocument[];
}
