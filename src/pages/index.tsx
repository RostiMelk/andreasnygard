import { useRef, useEffect } from "react";
import type { GetStaticProps } from "next";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout, RandomlyPositionedImageRow } from "@/components";

const Home = ({ work }: HomeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRefs = useRef<
    (HTMLAnchorElement | HTMLDivElement | null)[]
  >([]);

  return (
    <Layout>
      <section
        className="container z-50 mb-32 h-full w-full"
        ref={containerRef}
      >
        {work.map(({ _id, title, slug, mainImage }, index) => {
          const align = index % 2 === 0 ? "right" : "left";

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
