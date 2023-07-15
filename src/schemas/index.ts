import {
  aboutPage,
  blog,
  contactPage,
  homePage,
  notFoundPage,
  work,
} from "@/schemas/documents";
import { wysiwyg, imageRow } from "@/schemas/objects";

export const schemaTypes = [
  // Documents
  aboutPage,
  blog,
  contactPage,
  homePage,
  notFoundPage,
  work,

  // Objects
  imageRow,
  wysiwyg,
  // text,
];
