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

  plugins: [
    deskTool({
      structure(S, context) {
        return S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Homepage")
              .child(
                S.editor()
                  .id("homepage")
                  .schemaType("homePage")
                  .documentId("homePage")
              ),
            S.listItem()
              .title("About")
              .child(
                S.editor()
                  .id("aboutPage")
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
              ),
            S.listItem()
              .title("Contact")
              .child(
                S.editor()
                  .id("contactPage")
                  .schemaType("contactPage")
                  .documentId("contactPage")
              ),
            S.divider(),
            S.listItem()
              .title("Work")
              .child(
                S.documentTypeList("work")
                  .title("Work")
                  .child((documentId) =>
                    S.document().documentId(documentId).schemaType("work")
                  )
              ),
            S.listItem()
              .title("Blog")
              .child(
                S.documentTypeList("blog")
                  .title("Blog")
                  .child((documentId) =>
                    S.document().documentId(documentId).schemaType("blog")
                  )
              ),
          ]);
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
