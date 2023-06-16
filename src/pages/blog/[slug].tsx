import type { GetStaticPaths, GetStaticProps } from "next";

import type { BlogProps } from "./types";
import { client, groq } from "@/lib/sanity.client";
import { Layout, ContentBlocks } from "@/components";

const Blog = ({ blog }: BlogProps) => {
  const { title, meta, content } = blog ?? {};

  return (
    <Layout>
      <main className="container my-44">
        <section className="mb-48">
          <div className="two-col mb-20">
            {title && <h1 className="text-base">{title}</h1>}
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
    groq`*[_type == "blog" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<BlogProps> = async (context) => {
  const { slug = "" } = context.params ?? {};
  const blog: BlogProps["blog"] = await client.fetch(
    groq`
      *[_type == "blog" && slug.current == $slug][0] {
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
      blog,
    },
  };
};

export default Blog;
