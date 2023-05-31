import React from "react";
import { Wysiwyg, ImageRow } from "@/components";

interface Props {
  block: {
    _type: string;
    [key: string]: any;
  };
}

export const ContentBlocks = ({ block }: Props) => {
  const { _type, ...props } = block;

  return (
    <>
      {_type === "imageRow" && <ImageRow {...props} />}
      {_type === "wysiwyg" && <Wysiwyg value={block} />}
    </>
  );
};
