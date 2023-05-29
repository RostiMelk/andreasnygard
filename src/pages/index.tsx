import { useRef, useEffect } from "react";
import type { GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout } from "@/components";
import Matter from "matter-js";

const Home = ({ work }: HomeProps) => {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number>();
  const engineRef = useRef<Matter.Engine>();

  const router = useRouter();

  const animate = () => {
    engineRef.current = Matter.Engine.create();
    const engine: Matter.Engine = engineRef.current;

    engine.gravity.y = 0;
    engine.timing.timeScale = 5;

    const images: {
      body: Matter.Body;
      elem: HTMLElement;
      render: () => void;
    }[] = imageRefs.current.map((el, i) => {
      const width = el?.querySelector("img")?.clientWidth ?? 0;
      const height = el?.querySelector("img")?.clientHeight ?? 0;

      console.log({ width, height });

      const row = Math.floor(i); // Calculate the row number

      console.log({ row });

      const rand = (window.innerWidth - width) * Math.random();
      // const x = i % 2 === 0 ? rand : window.innerWidth - rand;
      const x = 0;

      // Calculate each row by image height + all previous rows
      const y = imageRefs.current.reduce(
        (acc, curr, i) => acc + (i < row ? curr.clientHeight : 0),
        0
      );

      return {
        body: Matter.Bodies.rectangle(x, y, width, height, {
          // frictionAir: 0.1, // Adjust this value to increase linear damping
        }),
        elem: el as HTMLElement,
        render() {
          const { x, y } = this.body.position;
          // this.elem.style.top = `${y - height / 2}px`;
          // this.elem.style.left = `${x - width / 2}px`;
          this.elem.style.transform = `translate(${x - width / 2}px, ${
            y - height / 2
          }px)`;
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
    const iw = window.innerWidth;
    const ih = document.body.scrollHeight;
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
  };

  useEffect(() => {
    animate();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
    };
  }, []);

  return (
    <Layout>
      <section className="container mb-32 h-full min-h-screen w-full">
        {work.map(({ _id, title, slug, mainImage }, index) => {
          return (
            <div
              // onClick={() => {
              //   router.push(`/work/${slug.current}`);
              // }}
              key={_id}
              className="group absolute inline-flex max-w-[300px] cursor-pointer flex-col will-change-transform hover:z-10 hover:underline"
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <Image
                src={urlFor(mainImage)?.url() ?? ""}
                alt=""
                quality={80}
                height={mainImage?.metadata?.dimensions?.height ?? 0}
                width={mainImage?.metadata?.dimensions?.width ?? 0}
                sizes="100vw"
                className="pointer-events-none max-h-[300px] max-w-[300px] select-none object-cover grayscale group-hover:grayscale-0"
              />
              <h4 className="invisible mt-4 text-base group-hover:visible">
                {title}
              </h4>
            </div>
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
