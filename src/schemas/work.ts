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
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
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
            prepare(selection) {
              return {
                title: selection.title || selection.description,
                subtitle: selection.title
                  ? selection.description
                  : "(No title provided)",
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "imageRows",
      title: "Image rows",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "imageRow",
              title: "Image row",
              type: "array",
              of: [{ type: "image" }],
              description: "Max 4 images per row",
              validation: (Rule) => Rule.max(4),
              options: { layout: "grid" },
            },
          ],
          preview: {
            select: {
              images: "imageRow",
            },
            prepare(selection) {
              const { images } = selection;
              const count = images ? images.length : 0;
              return {
                title: `${count} image${count === 1 ? "" : "s"}`,
                media: images && images.length > 0 ? images[0] : null,
              };
            },
          },
        },
      ],
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
