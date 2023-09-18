import {
  createClient,
  type SanityClient,
  type SanityDocument,
} from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import createImageUrlBuilder from "@sanity/image-url";
import groq from "groq";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const config = {
  projectId: projectId,
  dataset: dataset,
  useCdn: false,
  apiVersion: "2023-03-04",
  studioUrl: "/cms",
  perspective: "published" as const,
};

export const client: SanityClient = createClient(config);

export const urlFor = (source: SanityImageSource) =>
  createImageUrlBuilder(config).image(source);

// Re-export frequently used Sanity types and functions
export { groq };
export type { SanityDocument };
