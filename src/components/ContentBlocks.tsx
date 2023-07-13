import React from "react";
import { WorkWysiwyg, ImageRow } from "@/components";

interface Props {
  block: {
    _type: string;
    [key: string]: unknown;
  };
}

export const ContentBlocks = ({ block }: Props) => {
  const { _type, ...props } = block;

  return (
    <>
      {_type === "imageRow" && <ImageRow {...props} />}
      {_type === "wysiwyg" && <WorkWysiwyg value={block} />}
    </>
  );
};
