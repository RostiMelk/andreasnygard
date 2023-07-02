import { useRef, useEffect } from "react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import { isMobile } from "react-device-detect";

import type { BlogProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout } from "@/components";
import Matter from "matter-js";

const Blog = ({ blog }: BlogProps) => {
  const imageWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number>();
  const engineRef = useRef<Matter.Engine>();
  const mainRef = useRef<HTMLDivElement>(null);

  const animate = () => {
    engineRef.current = Matter.Engine.create();
    const engine: Matter.Engine = engineRef.current;

    engine.gravity.y = 0;
    engine.timing.timeScale = 5;

    const images: {
      body: Matter.Body;
      elem: HTMLElement;
      render: () => void;
    }[] = imageWrapperRefs.current.map((el, i) => {
      const width = el?.querySelector("img")?.clientWidth ?? 0;
      const height = el?.querySelector("img")?.clientHeight ?? 0;

      const gutter = 20;
      const halfWin = window.innerWidth / 2;
      const randX = Math.random() * (halfWin - width);
      const x = i % 2 === 0 ? randX + halfWin - gutter : randX + gutter;

      const y = imageWrapperRefs.current
        .slice(0, i)
        .reduce(
          (acc, el) => acc + Number(el?.querySelector("img")?.clientHeight),
          200
        );

      return {
        body: Matter.Bodies.rectangle(
          x + height / 2,
          y + width / 2,
          width,
          height,
          {
            // frictionAir: 0.1, // Adjust this value to increase linear damping
            collisionFilter: { category: 0b10 },
          }
        ),
        elem: el as HTMLElement,
        render() {
          const { x, y } = this.body.position;
          this.elem.style.transform = `translate(${x - width / 2}px, ${
            y - height / 2
          }px) rotate(${this.body.angle}rad)`;
        },
      };
    });

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      collisionFilter: { category: 0b10 },
    });

    // create a wall around the document.body
    const offset = 25;
    const wallOp = {
      isStatic: true,
    };
    const iw = mainRef.current?.clientWidth ?? 0;
    const ih = mainRef.current?.clientHeight ?? 0;
    const walls = [
      Matter.Bodies.rectangle(iw / 2, -offset, iw + 2 * offset, 50, wallOp),
      Matter.Bodies.rectangle(iw / 2, ih + offset, iw + 2 * offset, 50, wallOp),
      Matter.Bodies.rectangle(iw + offset, ih / 2, 50, ih + 2 * offset, wallOp),
      Matter.Bodies.rectangle(-offset, ih / 2, 50, ih + 2 * offset, wallOp),
    ];

    Matter.World.add(engine.world, [
      ...walls,
      ...images.map((box) => box.body),
      mouseConstraint,
    ]);

    const rerender = () => {
      images.forEach((image) => image.render());
      Matter.Engine.update(engine);
      requestRef.current = requestAnimationFrame(rerender);
    };

    rerender();

    if (mainRef.current) {
      const height = images.reduce(
        (acc, el) => acc + el.elem.clientHeight,
        200
      );

      mainRef.current.style.height = `${height}px`;
    }
  };

  useEffect(() => {
    if (isMobile) return;
    animate();

    const handleResize = () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      animate();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout className="z-20" ref={mainRef}>
      {blog.map(({ _id, image }, index) => {
        return (
          <div
            key={_id}
            className="absolute inline-flex max-w-[400px] cursor-pointer will-change-transform"
            ref={(el) => (imageWrapperRefs.current[index] = el)}
          >
            <Image
              alt=""
              blurDataURL={urlFor(image).width(30).url()}
              className="pointer-events-none select-none object-cover"
              height={image?.metadata?.dimensions?.height ?? 0}
              placeholder="blur"
              quality={50}
              sizes="100vw"
              src={urlFor(image)?.url() ?? ""}
              width={image?.metadata?.dimensions?.width ?? 0}
            />
          </div>
        );
      })}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blog: BlogProps["blog"] = await client.fetch(groq`
    *[_type == "blog"] {
      _id,
      image{
        ...asset->
      }
    }
  `);

  return {
    props: {
      blog,
    },
  };
};

export default Blog;
