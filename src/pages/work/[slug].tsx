import type { GetStaticPaths, GetStaticProps } from "next";

import type { WorkProps } from "./types";
import { client, groq } from "@/lib/sanity.client";
import { Layout, ContentBlocks } from "@/components";

const Work = ({ work }: WorkProps) => {
  const { title, content } = work ?? {};

  return (
    <Layout>
      <section className="col-right mt-32">
        {title && <h1 className="text-base">{title}</h1>}
      </section>

      <article className="my-24">
        {content?.map((block, i) => {
          return <ContentBlocks key={block._key} block={block} />;
        })}
      </article>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = await client.fetch(
    groq`*[_type == "work" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<WorkProps> = async (context) => {
  const { slug = "" } = context.params ?? {};

  const work: WorkProps["work"] = await client.fetch(
    groq`
      *[_type == "work" && slug.current == $slug][0] {
        ...,
        "content": content[]{
          ...,
          "imageRow": imageRow[] {
            ...,
            asset-> 
          }
        }
      }
    `,
    { slug }
  );

  if (!work) {
    return { notFound: true };
  }

  return {
    props: {
      work,
    },
  };
};

export default Work;
