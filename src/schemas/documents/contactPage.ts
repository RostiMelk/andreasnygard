import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
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
