import { useRef, useEffect, useCallback } from "react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout, Wysiwyg } from "@/components";
import Matter from "matter-js";

const Home = ({ homePage, work }: HomeProps) => {
  const imageWrapperRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const requestRef = useRef<number>();
  const engineRef = useRef<Matter.Engine>();
  const mainRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const clickThreshold = 5;
  let startX = 0;
  let startY = 0;

  const animate = useCallback(() => {
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

      const gutter = 100;
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

    // heights
    const iw = mainRef.current?.clientWidth ?? 0;
    let ih = 0;

    // set height of main element
    if (mainRef.current) {
      ih = images.reduce((acc, el) => acc + el.elem.clientHeight, 200);
      mainRef.current.style.height = `${ih}px`;
    }

    // create a wall around the document.body
    const wallOpt = {
      isStatic: true,
    };

    const walls = [
      Matter.Bodies.rectangle(iw / 2, -10, iw, 20, wallOpt), // top
      Matter.Bodies.rectangle(iw / 2, ih + 10, iw, 20, wallOpt), // bottom
      Matter.Bodies.rectangle(-10, ih / 2, 20, ih, wallOpt), // left
      Matter.Bodies.rectangle(iw + 10, ih / 2, 20, ih, wallOpt), // right
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
  }, []);

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

  const handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
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
      headerContinuation={homePage?.headerContinuation?.map((block) => (
        <Wysiwyg key={block._key} value={block} />
      ))}
      continuationClassName="lg:absolute"
      className="z-20"
      ref={mainRef}
      onTimeDoubleClick={() => {
        if (engineRef.current) {
          engineRef.current.gravity.y = 0.2;
        }
      }}
    >
      {work.map(
        ({ _id, title, shortTitle, slug, notClickable, mainImage }, index) => {
          return (
            <a
              onMouseDown={(e) =>
                !notClickable && !isMobile && handleMouseDown(e)
              }
              onMouseUp={(e) =>
                !notClickable && !isMobile && handleMouseUp(e, slug.current)
              }
              key={_id}
              className="blend-invert group my-4 inline-flex w-full cursor-pointer flex-col will-change-transform hover:z-10 hover:underline lg:absolute lg:max-w-[400px]"
              ref={(el) => (imageWrapperRefs.current[index] = el)}
              onClick={(e) => !isMobile && e.preventDefault()}
              href={notClickable ? undefined : `/work/${slug.current}`}
            >
              <Image
                alt=""
                blurDataURL={urlFor(mainImage).width(30).url()}
                className="pointer-events-none select-none object-cover grayscale group-hover:grayscale-0"
                height={mainImage?.metadata?.dimensions?.height ?? 0}
                placeholder="blur"
                quality={60}
                sizes="100vw"
                src={urlFor(mainImage)?.url() ?? ""}
                width={mainImage?.metadata?.dimensions?.width ?? 0}
              />
              <h4 className="mt-4 text-base group-hover:visible lg:invisible">
                {shortTitle ?? title}
              </h4>
            </a>
          );
        }
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const homePage: HomeProps["homePage"] = await client.fetch(groq`
    *[_type == "homePage"][0] {
      headerContinuation,
    }
  `);

  const work: HomeProps["work"] = await client.fetch(groq`
    *[_type == "work"] {
      _id,
      title,
      shortTitle,
      notClickable,
      slug,
      mainImage{
        ...asset->
      }
    }
  `);

  return {
    props: {
      homePage,
      work,
    },
  };
};

export default Home;
