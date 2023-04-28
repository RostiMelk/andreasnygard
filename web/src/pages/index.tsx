import { useEffect, useRef } from "react";
import clsx from "clsx";
import { type NextPage } from "next";
import Image from "next/image";

import { Layout } from "@/components/views";

const testImageSizes = [
  [536, 301],
  [395, 395],
  [536, 302],
  [400, 285],
  [393, 221],
  [395, 568],
  // [536, 301],
  // [395, 395],
  // [536, 302],
  // [400, 285],
  // [393, 221],
  // [395, 568],
  // [536, 301],
  // [395, 395],
  // [536, 302],
  // [400, 285],
  // [393, 221],
  // [395, 568],
  // [536, 301],
  // [395, 395],
  // [536, 302],
  // [400, 285],
  // [393, 221],
  // [395, 568],
  // [536, 301],
  // [395, 395],
  // [536, 302],
  // [400, 285],
  // [393, 221],
  // [395, 568],
];

const Home: NextPage = () => {
  return (
    <Layout
      headerContinuation={
        <>
          is a graphic designer, based in Oslo, Norway.He believes good design
          (whatever that means) can be a force for change, and bring people
          closer to each other.Andreas currently works as a designer at{" "}
          <a href="https://stem.no" target="_blank" className="external-link">
            Stem Agency
          </a>
          .
        </>
      }
    >
      <div className="container -mt-32">
        {testImageSizes.map((imageSize, index) => {
          const url = `https://picsum.photos/${imageSize.join("/")}`;
          const align = index % 2 === 0 ? "right" : "left";
          return <WorkImageRow key={url} imageUrl={url} align={align} />;
        })}
      </div>
    </Layout>
  );
};

const WorkImageRow = ({
  imageUrl,
  align = "left",
}: {
  imageUrl: string;
  align: "left" | "right";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    // Get the width of the container and the image
    const containerWidth = container.offsetWidth;

    // Calculate maximum image size
    const MAX_PIXELS = 500000;
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

    // Calculate a random X position for the image within the container
    const x = Math.floor(Math.random() * (containerWidth - width));

    // Calculate a random margin top for the container
    const marginTop = Math.floor(Math.random() * 120) - 40;

    // Log some values for debugging
    console.log({ containerWidth, width, x, marginTop });

    // Set the size and position of the image
    image.style.width = `${width}px`;
    image.style.height = `${height}px`;
    image.style.transform = `translateX(${x}px)`;

    // Set the margin top of the container
    container.style.marginTop = `${marginTop}px`;
  }, [containerRef, imageRef]);

  return (
    <div className="two-col relative">
      <div
        ref={containerRef}
        className={clsx({ "col-start-2": align === "right" })}
      >
        <Image
          ref={imageRef}
          src={imageUrl}
          alt=""
          height="0"
          width="0"
          sizes="100vw"
        />
      </div>
    </div>
  );
};
export default Home;
