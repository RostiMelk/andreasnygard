import type { GetStaticPaths, GetStaticProps } from "next";

import type { WorkProps } from "./types";
import { client, groq } from "@/lib/sanity.client";
import { Layout, ContentBlocks } from "@/components";

const Work = ({ work }: WorkProps) => {
  const { title, content } = work ?? {};

  return (
    <Layout>
      <main className="container my-44">
        <section className="mb-24">
          {title && <h1 className="text-base">{title}</h1>}
        </section>

        <article>
          {content?.map((block, i) => {
            if (block._type === "wysiwyg") {
              // Find the index of the next non-"wysiwyg" block
              const endIndex = content
                .slice(i + 1)
                .findIndex((nextBlock) => nextBlock._type !== "wysiwyg");
              const sectionContent =
                endIndex === -1
                  ? content.slice(i)
                  : content.slice(i, i + endIndex + 1);

              return (
                <section key={block._key} className="my-24">
                  {sectionContent.map((sectionBlock) => (
                    <ContentBlocks
                      key={sectionBlock._key}
                      block={sectionBlock}
                    />
                  ))}
                </section>
              );
            }

            return <ContentBlocks key={block._key} block={block} />;
          })}
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
