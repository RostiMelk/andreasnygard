import { defineField, defineType } from "sanity";

export default defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      description: "Not used anywhere, just for keeping track of documents",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: (new Date()).toISOString(),
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
