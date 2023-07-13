import type { GetStaticProps } from "next";

import type { AboutProps } from "./types";
import { client, groq } from "@/lib/sanity.client";
import { Layout, Wysiwyg, AboutWysiwyg } from "@/components";

const About = ({ aboutPage }: AboutProps) => {
  return (
    <Layout
      headerContinuation={aboutPage?.headerContinuation?.map((block) => (
        <Wysiwyg key={block._key} value={block} />
      ))}
    >
      <article className="two-col">
        <section>
          <h2 className="mb-7 border-b">Currently:</h2>
          {aboutPage?.currentWork?.map((block) => (
            <AboutWysiwyg key={block._key} value={block} />
          ))}
        </section>
        <section>
          <h2 className="mb-7 border-b">Previously:</h2>
          {aboutPage?.previousWork?.map((block) => (
            <AboutWysiwyg key={block._key} value={block} />
          ))}
        </section>
      </article>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const aboutPage: AboutProps["aboutPage"] = await client.fetch(groq`
    *[_type == "aboutPage"][0] {
      headerContinuation,
      currentWork,
      previousWork,
    }
  `);

  return {
    props: {
      aboutPage,
    },
  };
};

export default About;
