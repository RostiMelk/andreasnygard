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
  return (
    <section className={clsx("mb-8 flex gap-8", className)}>
      {imageRow?.map(({ asset, _key }) => (
        <div key={_key} className="flex-1">
          <Image
            src={urlFor(asset)?.url() ?? ""}
            placeholder="blur"
            blurDataURL={urlFor(asset).width(50).url()}
            width={asset?.metadata?.dimensions?.width ?? 0}
            height={asset?.metadata?.dimensions?.height ?? 0}
            alt={""} // TODO: Add alt text
            className="h-auto"
            quality={70}
          />
        </div>
      ))}
    </section>
  );
};
