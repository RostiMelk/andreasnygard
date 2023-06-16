import React from "react";
import { PortableText } from "@portabletext/react";
import clsx from "clsx";
const components = {
  block: {
    normal: (props: any) => (
      <p {...props} className="ml-auto indent-7 text-base lg:w-1/2" />
    ),
  },
  list: {
    bullet: (props: any) => (
      <ul {...props} className="mb-4 ml-4 list-disc text-base" />
    ),
    number: (props: any) => (
      <ol {...props} className="mb-4 ml-4 list-decimal text-base" />
    ),
  },
};

export const Wysiwyg = (props: any) => {
  console.log(props);
  return <PortableText {...props} components={components} />;
};
