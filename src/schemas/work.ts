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
    // defineField({
    //   name: "body",
    //   title: "Body",
    //   type: "blockContent",
    // }),
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
            prepare({ images }: { images?: string[] }) {
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
