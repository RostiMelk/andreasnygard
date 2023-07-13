import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "headerContinuation",
      title: "Header continuation",
      description: "Andreas Nygård ...",
      type: "array",
      of: [{ type: "wysiwyg" }],
    }),
    defineField({
      name: "currentWork",
      title: "Current work",
      type: "array",
      of: [{ type: "wysiwyg" }],
    }),
    defineField({
      name: "previousWork",
      title: "Previous work",
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
