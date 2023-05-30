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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meta",
      title: "Meta",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
            },
            {
              name: "description",
              title: "Description",
              type: "string",
            },
            {
              name: "link",
              title: "Link",
              description: "Opens in new tab (optional)",
              type: "string",
            },
          ],
          preview: {
            select: {
              title: "title",
              description: "description",
            },
            prepare({
              title,
              description,
            }: {
              title?: string;
              description?: string;
            }) {
              const subtitle = title ? description : "(No title provided)";
              return {
                title: title || subtitle,
                subtitle,
              };
            },
          },
        },
      ],
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
