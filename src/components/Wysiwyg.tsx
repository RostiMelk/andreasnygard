import React from "react";
import { PortableText } from "@portabletext/react";

const components = {
  block: {
    normal: (props: any) => <p {...props} className="mb-4 text-base" />,
    h1: (props: any) => <h1 {...props} className="mb-4 text-lg" />,
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
