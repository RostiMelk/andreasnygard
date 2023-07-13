import { defineType } from "sanity";

export default defineType({
  title: "WYSIWYG",
  name: "wysiwyg",
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  lists: [{ title: "Bullet", value: "bullet" }],
  marks: {
    decorators: [],
    annotations: [
      {
        title: "URL",
        name: "link",
        type: "object",
        fields: [
          {
            title: "URL",
            name: "href",
            type: "url",
            validation: (Rule) =>
              Rule.uri({
                scheme: ["http", "https", "mailto", "tel"],
              }),
          },
        ],
      },
    ],
  },
});
