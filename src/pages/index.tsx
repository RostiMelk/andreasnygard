import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout, PhysicsImageRow } from "@/components";

const Home = ({ work }: HomeProps) => {
  console.log(work);
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
      <div className="container -mt-32 mb-32">
        {work.map(({ _key, title, slug, mainImage }, index) => {
          const align = index % 2 === 0 ? "right" : "left";
          return (
            <PhysicsImageRow
              key={_key}
              imageUrl={urlFor(mainImage)?.url() ?? ""}
              imageWidth={mainImage?.metadata?.dimensions?.width ?? 0}
              imageHeight={mainImage?.metadata?.dimensions?.height ?? 0}
              align={align}
              title={title}
              href={`/work/${slug?.current}`}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const work: HomeProps["work"] = await client.fetch(groq`
    *[_type == "work"] {
      _key,
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
