import React, { useEffect, useRef } from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import type { SanityImageAssetDocument } from "@sanity/client";
import clsx from "@/lib/clsx";
import type { VideoAssetDocument } from "sanity-plugin-mux-input";

import { urlFor } from "@/lib/sanity.client";

interface Props {
  className?: string;
  imageRow?: Array<
    | {
        _key: string;
        _type: "image";
        asset: SanityImageAssetDocument;
      }
    | {
        _key: string;
        _type: "mux.video";
        asset: VideoAssetDocument;
      }
  >;
}

/**
 * Image width is based on the number of images in the row.
 */
const imageWidth: Record<number, number> = {
  1: 1800,
  2: 900,
  3: 600,
};

export const ImageRow = ({ className, imageRow }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          ref.current?.classList.add("opacity-100");
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.25,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref}
      className={clsx(
        "mb-8 flex flex-col gap-8 opacity-0 transition-all duration-500 md:flex-row",
        className
      )}
    >
      {imageRow?.map(({ asset, _type, _key }) => {
        if (_type === "image") {
          return (
            <div key={_key} className="flex-1">
              <Image
                alt={""} // TODO: Add alt text
                // blurDataURL={urlFor(asset).width(50).quality(20).url()}
                blurDataURL={image?.metadata?.lqip}
                className="h-auto w-full"
                height={asset?.metadata?.dimensions?.height ?? 0}
                placeholder="blur"
                quality={100}
                src={urlFor(asset)
                  .width(imageWidth[imageRow.length] ?? 1800)
                  .quality(85)
                  .url()}
                width={asset?.metadata?.dimensions?.width ?? 0}
              />
            </div>
          );
        }

        if (_type === "mux.video") {
          return (
            <div
              key={_key}
              className="flex-1 object-cover [--controls:none] [--media-secondary-color:#fff]"
              // style={{
              //   aspectRatio: asset?.data?.aspect_ratio?.replace(":", "/"),
              // }}
            >
              <MuxPlayer
                autoPlay={true}
                loop={true}
                muted={true}
                playbackId={asset.playbackId}
                playsInline={true}
                streamType="on-demand"
                className="flex h-full bg-white object-cover opacity-0 transition-opacity duration-500 [&>video]:-m-[1px] [&>video]:[clip-path:inset(1px)]"
                disableCookies={true}
                onLoadedData={(e) => {
                  const target = e?.target as HTMLVideoElement;
                  target?.classList?.remove("opacity-0");
                }}
              />
            </div>
          );
        }
      })}
    </section>
  );
};
