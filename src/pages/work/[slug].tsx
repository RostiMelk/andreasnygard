import type { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";

import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout } from "@/components/views";
import type { WorkProps } from "./types";

const Work = ({ work }: WorkProps) => {
  const { title, meta, imageRows } = work ?? {};

  return (
    <Layout>
      <main className="container my-44">
        <section className="mb-48">
          <div className="two-col mb-20">
            {title && <h1 className="text-lg">{title}</h1>}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {meta?.map(({ title, description }, index) => (
              <div key={index}>
                <h4 className="text-base">{title || "ㅤ"}</h4>
                <p className="text-base">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          {imageRows?.map(({ imageRow, _key }) => (
            <div key={_key} className="mb-24 flex gap-8">
              {imageRow?.map(({ asset, _key }) => (
                <Image
                  key={_key}
                  src={urlFor(asset)?.url() ?? ""}
                  width={asset?.metadata?.dimensions?.width ?? 0}
                  height={asset?.metadata?.dimensions?.height ?? 0}
                  alt={asset?.alt ?? ""}
                  className="h-full"
                />
              ))}
            </div>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = await client.fetch(
    groq`*[_type == "work" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<WorkProps> = async (context) => {
  const { slug = "" } = context.params ?? {};
  const work: WorkProps["work"] = await client.fetch(
    groq`
      *[_type == "work" && slug.current == $slug][0] {
        ...,
        "imageRows": imageRows[] {
          ...,
          "imageRow": imageRow[] {
            ...,
            "asset": asset->,
          }
        }
        
    `,
    { slug }
  );

  return {
    props: {
      work,
    },
  };
};

export default Work;
