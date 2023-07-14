import { useRef } from "react";
import type { GetStaticProps } from "next";
import Image from "next/legacy/image";

import type { BlogProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout } from "@/components";
import { useMatterGrid } from "@/hooks";

const Blog = ({ blog }: BlogProps) => {
  const imageWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);
  const { engineRef } = useMatterGrid({
    imageWrapperRefs,
    mainRef,
    spacing: 0,
  });

  return (
    <Layout
      className="z-20"
      ref={mainRef}
      onTimeDoubleClick={() => {
        if (engineRef.current) {
          engineRef.current.gravity.y = 0.2;
        }
      }}
    >
      {blog?.map(({ _id, image }, index) => {
        return (
          <div
            key={_id}
            className="mb-7 w-full will-change-transform hover:z-10 lg:absolute lg:mb-0 lg:max-w-[400px] lg:opacity-0 lg:transition-opacity"
            ref={(el) => (imageWrapperRefs.current[index] = el)}
          >
            <Image
              alt=""
              blurDataURL={urlFor(image).width(50).quality(20).url()}
              className="pointer-events-none select-none object-cover"
              height={image?.metadata?.dimensions?.height ?? 0}
              placeholder="blur"
              sizes="100vw"
              src={urlFor(image)?.width(400).quality(85).url()}
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
