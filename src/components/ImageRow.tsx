import React from "react";
import Image from "next/legacy/image";
import type { SanityImageAssetDocument } from "@sanity/client";
import clsx from "@/lib/clsx";

import { urlFor } from "@/lib/sanity.client";

interface Props {
  className?: string;
  imageRow?: {
    _key: string;
    asset: SanityImageAssetDocument;
  }[];
}

export const ImageRow = ({ className, imageRow }: Props) => {
  const maxWidth: Record<number, number> = {
    1: 1800,
    2: 900,
    3: 600,
  };

  return (
    <section
      className={clsx("mb-8 flex flex-col gap-8 md:flex-row", className)}
    >
      {imageRow?.map(({ asset, _key }) => (
        <div key={_key} className="flex-1">
          <Image
            src={urlFor(asset)
              .width(maxWidth[imageRow.length] ?? 1800)
              .quality(70)
              .url()}
            placeholder="blur"
            blurDataURL={urlFor(asset).width(50).url()}
            width={asset?.metadata?.dimensions?.width ?? 0}
            height={asset?.metadata?.dimensions?.height ?? 0}
            alt={""} // TODO: Add alt text
            className="h-auto w-full"
          />
        </div>
      ))}
    </section>
  );
};
