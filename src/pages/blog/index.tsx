import { useRef } from "react";
import type { GetStaticProps } from "next";
import { Image } from "@/components/Image";

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
      {blog
        ?.filter((item) => item.image)
        .map(({ _id, image }, index) => {
          return (
            <div
              key={_id}
              className="mb-7 w-full will-change-transform hover:z-10 md:!max-w-[400px] notouch:absolute  notouch:mb-0 notouch:max-w-[70vw] notouch:opacity-0 notouch:transition-opacity"
              ref={(el) => (imageWrapperRefs.current[index] = el)}
            >
              <Image
                alt=""
                blurDataURL={image?.metadata?.lqip}
                className="pointer-events-none select-none object-cover"
                height={image?.metadata?.dimensions?.height ?? 0}
                loading={index <= 3 ? "eager" : "lazy"}
                placeholder="blur"
                src={urlFor(image)?.width(600).quality(85).url()}
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
