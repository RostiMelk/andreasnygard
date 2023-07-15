import { defineField, defineType } from "sanity";

export default defineType({
  name: "notFoundPage",
  title: "404 Page",
  type: "document",
  fields: [
    defineField({
      name: "headerContinuation",
      title: "Content",
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
