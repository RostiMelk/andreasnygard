import { useRef, useEffect } from "react";
import type { GetStaticProps } from "next";
import Matter from "matter-js";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout, RandomlyPositionedImageRow } from "@/components";

const Home = ({ work }: HomeProps) => {
  const requestRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRefs = useRef<
    (HTMLAnchorElement | HTMLDivElement | null)[]
  >([]);
  const engineRef = useRef<Matter.Engine | null>(null);

  /**
   * Make imageWrapperRefs draggable around the screen within the containerRef
   * No gravity is applied.
   */
  const animate = () => {
    if (!containerRef.current) return;

    engineRef.current = Matter.Engine.create();
    const engine = engineRef.current;

    // engine.gravity = { x: 0, y: 0, scale: 0 };

    const images = imageWrapperRefs.current.map((imageWrapper) => {
      const bounds = imageWrapper?.getBoundingClientRect();
      return Matter.Bodies.rectangle(
        bounds?.x ?? 0,
        bounds?.y ?? 0,
        bounds?.width ?? 0,
        bounds?.height ?? 0,
        { label: "image", frictionAir: 0.1 }
      );
    });

    const roof = Matter.Bodies.rectangle(
      containerRef.current.clientWidth / 2,
      -10,
      containerRef.current.clientWidth,
      20,
      { isStatic: true, label: "roof" }
    );

    const floor = Matter.Bodies.rectangle(
      containerRef.current.clientWidth / 2,
      containerRef.current.clientHeight + 10,
      containerRef.current.clientWidth,
      20,
      { isStatic: true, label: "floor" }
    );

    const leftWall = Matter.Bodies.rectangle(
      -10,
      containerRef.current.clientHeight / 2,
      20,
      containerRef.current.clientHeight,
      { isStatic: true, label: "leftWall" }
    );

    const rightWall = Matter.Bodies.rectangle(
      containerRef.current.clientWidth + 10,
      containerRef.current.clientHeight / 2,
      20,
      containerRef.current.clientHeight,
      { isStatic: true, label: "rightWall" }
    );

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      // @ts-ignore
      element: containerRef.current,
    });

    Matter.Composite.add(engine.world, [
      ...images,
      roof,
      floor,
      leftWall,
      rightWall,
      mouseConstraint,
    ]);

    (function rerender() {
      images.forEach((image, index) => {
        const imageWrapper = imageWrapperRefs.current[index];
        if (imageWrapper) {
          imageWrapper.style.transform = `translate(${image.position.x}px, ${image.position.y}px)`;
        }
      });
      requestRef.current = requestAnimationFrame(rerender);
      Matter.Engine.update(engine);
    })();
  };

  useEffect(() => {
    setTimeout(() => {
      animate();
    }, 100);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, [imageWrapperRefs]);

  return (
    <Layout
    // headerContinuation={
    //   <>
    //     is a graphic designer, based in Oslo, Norway.He believes good design
    //     (whatever that means) can be a force for change, and bring people
    //     closer to each other.Andreas currently works as a designer at{" "}
    //     <a href="https://stem.no" target="_blank" className="external-link">
    //       Stem Agency
    //     </a>
    //     .
    //   </>
    // }
    >
      <section
        className="container  absolute left-0 top-0 z-50 mb-32 h-full w-full"
        ref={containerRef}
      >
        {work.map(({ _id, title, slug, mainImage }, index) => {
          const align = index % 2 === 0 ? "right" : "left";
          return (
            <div
              key={index}
              ref={(el) => (imageWrapperRefs.current[index] = el)}
              className="pointer-events-auto absolute left-0 top-0 h-10 w-10 cursor-move bg-red-700"
            ></div>
          );
          return (
            <RandomlyPositionedImageRow
              key={_id}
              imageUrl={urlFor(mainImage)?.url() ?? ""}
              imageWidth={mainImage?.metadata?.dimensions?.width ?? 0}
              imageHeight={mainImage?.metadata?.dimensions?.height ?? 0}
              align={align}
              title={title}
              href={`/work/${slug?.current}`}
              ref={(el) => (imageWrapperRefs.current[index] = el)}
            />
          );
        })}
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const work: HomeProps["work"] = await client.fetch(groq`
    *[_type == "work"] {
      _id,
      title,
      slug,
      mainImage{
        ...asset->
      }
    }
  `);

  return {
    props: {
      work,
    },
  };
};

export default Home;
