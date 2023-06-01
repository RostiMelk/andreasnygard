import { useRef, useEffect } from "react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout } from "@/components";
import Matter from "matter-js";

const Home = ({ work }: HomeProps) => {
  const imageWrapperRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const requestRef = useRef<number>();
  const engineRef = useRef<Matter.Engine>();
  const mainRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const clickThreshold = 5;
  let startX = 0;
  let startY = 0;

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
    animate();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  const handleImageMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;
  };

  const handleImageMouseUp = (
    event: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
    event.preventDefault();
    const endX = event.clientX;
    const endY = event.clientY;
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);

    if (deltaX <= clickThreshold && deltaY <= clickThreshold) {
      void router.push(`/work/${slug}`);
    }
  };

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
          <br />
          <br />
          While he cites brand identity, strategy, illustration and copywriting
          as some of his greatest professional strengths, he is chronically
          curious and is always on the search for new typologies, methods and
          contexts to work within.
        </>
      }
      className="z-20"
      ref={mainRef}
    >
      {work.map(({ _id, title, slug, mainImage }, index) => {
        return (
          <a
            onMouseDown={handleImageMouseDown}
            onMouseUp={(event) => handleImageMouseUp(event, slug.current)}
            onTouchEnd={() => void router.push(`/work/${slug.current}`)}
            key={_id}
            className="blend-invert group absolute inline-flex max-w-[400px] cursor-pointer flex-col will-change-transform hover:z-10 hover:underline"
            ref={(el) => (imageWrapperRefs.current[index] = el)}
          >
            <Image
              alt=""
              blurDataURL={urlFor(mainImage).width(30).url()}
              className="pointer-events-none select-none object-cover grayscale group-hover:grayscale-0"
              height={mainImage?.metadata?.dimensions?.height ?? 0}
              placeholder="blur"
              quality={70}
              sizes="100vw"
              src={urlFor(mainImage)?.url() ?? ""}
              width={mainImage?.metadata?.dimensions?.width ?? 0}
            />
            <h4 className="invisible mt-4 text-base group-hover:visible">
              {title}
            </h4>
          </a>
        );
      })}
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
