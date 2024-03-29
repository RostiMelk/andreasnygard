import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "headerContinuation",
      title: "Header continuation",
      description: "Andreas Nygård ...",
      type: "array",
      of: [{ type: "wysiwyg" }],
    }),
  ],
  preview: {
    select: {},
    prepare(selection) {
      return { ...selection };
    },
  },
});
