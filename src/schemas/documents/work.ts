import { defineField, defineType } from "sanity";

export default defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Short title",
      type: "string",
      description:
        "Short title used in case overview. If not set, title is used.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "notClickable",
      title: "Not clickable",
      type: "boolean",
      description:
        "If toggled, the work will not be clickable in the overview.",
      initialValue: false,
    }),
    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: (new Date()).toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "imageRow" }, { type: "wysiwyg" }],
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
    prepare(selection) {
      return { ...selection };
    },
  },
});
