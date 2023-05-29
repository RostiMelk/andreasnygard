import React, {
  forwardRef,
  useEffect,
  useRef,
  useImperativeHandle,
} from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  href: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  align: "left" | "right";
}

export const RandomlyPositionedImageRow = forwardRef(
  function RandomlyPositionedImageRow(
    { title, href, imageUrl, imageWidth, imageHeight, align }: Props,
    ref: React.Ref<HTMLAnchorElement | null>
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLAnchorElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // merge refs
    useImperativeHandle(ref, () => wrapperRef.current);

    // useEffect(() => {
    //   const container = containerRef.current;
    //   const image = imageRef.current;
    //   const wrapper = wrapperRef.current;
    //   if (!container || !image || !wrapper) return;

    //   const containerWidth = container.offsetWidth;
    //   const x = Math.floor(Math.random() * (containerWidth - imageWidth));
    //   const marginTop = Math.floor(Math.random() * 120) - 40;

    //   container.style.marginTop = `${marginTop}px`;
    //   wrapper.style.transform = `translateX(${x}px`;
    //   wrapper.style.width = `${imageWidth}px`;
    // }, [containerRef, imageRef, wrapperRef, imageWidth, imageHeight]);

    return (
      <div className="two-col relative">
        <div
          ref={containerRef}
          className={clsx({ "col-start-2 ": align === "right" })}
        >
          <Link
            href={href}
            className="group pointer-events-auto inline-flex flex-col hover:underline"
            ref={wrapperRef}
            style={{ width: imageWidth }}
          >
            <Image
              ref={imageRef}
              src={imageUrl}
              alt=""
              height={imageHeight}
              width={imageWidth}
              sizes="100vw"
              className="max-h-[400px] max-w-[400px] object-cover grayscale group-hover:grayscale-0"
            />
            <h4 className="invisible mt-4 text-base group-hover:visible">
              {title}
            </h4>
          </Link>
        </div>
      </div>
    );
  }
);
