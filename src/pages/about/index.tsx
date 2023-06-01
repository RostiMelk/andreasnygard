import type { GetStaticPaths, GetStaticProps } from "next";

import { Layout } from "@/components";

const Work = () => {
  return (
    <Layout
      headerContinuation={
        <>
          <p>
            T: <a href="tel:+4798123011">+47 981 23 011</a>
          </p>
          <p>
            E:{" "}
            <a href="mailto:hello@andreasnygard.no">
              hello@hello@andreasnygard.no
            </a>
          </p>
          <p>
            <a href="https://www.linkedin.com/in/andreasnygard/">Linkedin</a>
          </p>
          <p>
            <a href="https://www.instagram.com/andreasnygard/">Instagram</a>
          </p>
        </>
      }
    />
  );
};

export default Work;
