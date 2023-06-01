import type { GetStaticPaths, GetStaticProps } from "next";

import { Layout } from "@/components";

const Work = () => {
  return (
    <Layout
      headerContinuation={
        <>
          T: <a href="tel:+4798123011">+47 981 23 011</a>
          <br />
          E:{" "}
          <a href="mailto:hello@andreasnygard.no">
            hello@hello@andreasnygard.no
          </a>
          <br />
          <a href="https://www.linkedin.com/in/andreasnygard/">Linkedin</a>
          <br />
          <a href="https://www.instagram.com/andreasnygard/">Instagram</a>
        </>
      }
    />
  );
};

export default Work;
