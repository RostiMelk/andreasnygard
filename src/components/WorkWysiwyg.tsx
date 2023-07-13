import React from "react";
import { PortableText } from "@portabletext/react";

const components = {
  block: {
    normal: (props: any) => (
      <p
        {...props}
        className="text col-right my-24 indent-7 text-base [&+.text]:-mt-24 [&>a]:underline"
      />
    ),
  },
  list: {
    bullet: (props: any) => (
      <ul
        {...props}
        className="list col-right my-24 mb-4 ml-4 list-disc text-base lg:w-1/2 [&+.list]:-mt-24 [&>a]:underline"
      />
    ),
    number: (props: any) => (
      <ol
        {...props}
        className="list col-right my-24 mb-4 ml-4 list-decimal text-base lg:w-1/2 [&+.list]:-mt-24 [&>a]:underline"
      />
    ),
  },
};

export const WorkWysiwyg = (props: any) => {
  return <PortableText {...props} components={components} />;
};
