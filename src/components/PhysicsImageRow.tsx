import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  href: string;
  imageUrl: string;
  align: "left" | "right";
}

export const PhysicsImageRow = ({
  title,
  href,
  imageUrl,
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

    // Calculate maximum image size
    const MAX_PIXELS = 300000;
    const aspectRatio = image.naturalWidth / image.naturalHeight;
    const maxDimension = Math.sqrt(MAX_PIXELS);

    let width, height;
    if (aspectRatio >= 1) {
      // If the image is wider than tall, limit the width and calculate the height
      width = Math.min(maxDimension, image.naturalWidth * 1.8);
      height = width / aspectRatio;
    } else {
      // If the image is taller than wide, limit the height and calculate the width
      height = Math.min(maxDimension, image.naturalHeight * 1.8);
      width = height * aspectRatio;
    }

    // Calculate a random X position for the wrapper within the container
    const x = Math.floor(Math.random() * (containerWidth - width));

    // Calculate a random margin top for the container
    const marginTop = Math.floor(Math.random() * 120) - 40;

    // Set the size and position of the image
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;

    // Set the margin top of the container
    container.style.marginTop = `${marginTop}px`;

    // Set the left position of the wrapper
    wrapper.style.transform = `translateX(${x}px`;
    wrapper.style.width = `${width}px`;
  }, [containerRef, imageRef, wrapperRef]);

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
        >
          <Image
            ref={imageRef}
            src={imageUrl}
            alt=""
            height="0"
            width="0"
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
