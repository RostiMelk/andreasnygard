import type { GetStaticProps } from "next";

import type { ContactProps } from "./types";
import { client, groq } from "@/lib/sanity.client";
import { Layout, Wysiwyg } from "@/components";

const Contact = ({ contactPage }: ContactProps) => {
  return (
    <Layout
      headerContinuation={contactPage?.headerContinuation.map((block) => (
        <Wysiwyg key={block._key} value={block} />
      ))}
      continuationClassName="grid [&>p]:indent-0"
    />
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const contactPage: ContactProps["contactPage"] = await client.fetch(groq`
    *[_type == "contactPage"][0] {
      headerContinuation,
    }
  `);

  return {
    props: {
      contactPage,
    },
  };
};

export default Contact;
