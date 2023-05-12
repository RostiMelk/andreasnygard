import React, { useEffect, useRef } from "react";
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

export const PhysicsImageRow = ({
  title,
  href,
  imageUrl,
  imageWidth,
  imageHeight,
  align = "left",
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !image || !wrapper) return;

    // Get the width of the container and the image
    const containerWidth = container.offsetWidth;

    // Calculate a random X position for the wrapper within the container
    const x = Math.floor(Math.random() * (containerWidth - imageWidth));

    // Calculate a random margin top for the container
    const marginTop = Math.floor(Math.random() * 120) - 40;

    // Set the margin top of the container
    container.style.marginTop = `${marginTop}px`;

    // Set the left position of the wrapper
    wrapper.style.transform = `translateX(${x}px`;
    wrapper.style.width = `${imageWidth}px`;
  }, [containerRef, imageRef, wrapperRef, imageWidth]);

  console.log({ imageWidth, imageHeight });

  return (
    <div className="two-col relative">
      <div
        ref={containerRef}
        className={clsx({ "col-start-2": align === "right" })}
      >
        <Link
          href={href}
          className="group inline-flex flex-col hover:underline"
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
          />

          <h4 className="invisible mt-4  text-base group-hover:visible">
            {title}
          </h4>
        </Link>
      </div>
    </div>
  );
};
