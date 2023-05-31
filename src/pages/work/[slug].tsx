import type { GetStaticPaths, GetStaticProps } from "next";

import type { WorkProps } from "./types";
import { client, groq } from "@/lib/sanity.client";
import { Layout, ContentBlocks } from "@/components";

const Work = ({ work }: WorkProps) => {
  const { title, meta, content } = work ?? {};

  return (
    <Layout>
      <main className="container my-44">
        <section className="mb-48">
          <div className="two-col mb-20">
            {title && <h1 className="text-lg">{title}</h1>}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {meta?.map(({ title, description, link }, index) => (
              <div key={index}>
                <h4 className="text-base">{title || "ㅤ"}</h4>
                <p className="text-base">
                  {typeof link === "string" ? (
                    <a href={link} className="external-link">
                      {description}
                    </a>
                  ) : (
                    description
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        <article>
          {content?.map((block) => (
            <ContentBlocks key={block._key} block={block} />
          ))}
        </article>
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

  return {
    props: {
      work,
    },
  };
};

export default Work;
