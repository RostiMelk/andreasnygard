import React from "react";
import { PortableText } from "@portabletext/react";

const components = {
  block: {
    normal: (props: any) => (
      <p {...props} className="mb-7 text-base [&>a]:underline" />
    ),
  },
  list: {
    bullet: (props: any) => (
      <ul
        {...props}
        className="mb-4 ml-4 list-disc text-base lg:w-1/2 [&>a]:underline"
      />
    ),
    number: (props: any) => (
      <ol
        {...props}
        className="mb-4 ml-4 list-decimal text-base lg:w-1/2 [&>a]:underline"
      />
    ),
  },
};

export const AboutWysiwyg = (props: any) => {
  return <PortableText {...props} components={components} />;
};
