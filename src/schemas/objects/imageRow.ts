import { defineType, defineArrayMember } from "sanity";

export default defineType({
  title: "Image Row",
  name: "imageRow",
  type: "object",
  fields: [
    {
      name: "imageRow",
      title: "Image row",
      type: "array",
      of: [defineArrayMember({ type: "image" })],
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
        subtitle: "Image row block",
      };
    },
  },
});
