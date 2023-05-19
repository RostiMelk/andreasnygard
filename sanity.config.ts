import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { schemaTypes } from "@/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  basePath: "/cms",

  name: "default",
  title: "Andreas Nygård",
  apiVersion: "2023-03-04",
  projectId: projectId,
  dataset: dataset,

  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
