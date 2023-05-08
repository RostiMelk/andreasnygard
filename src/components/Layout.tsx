import Head from "next/head";
import React from "react";

import { Header, Footer } from "@/components";

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  headerContinuation?: React.ReactNode;
}

export const Layout = ({
  title,
  description,
  children,
  headerContinuation,
}: Props): JSX.Element => {
  /**
   * Meta tags:
   */
  title = title ? `${title} | Andreas Nygård` : "Andreas Nygård";
  description = description || "Andreas Nygård";

  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="charset" charSet="utf-8" />
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <link
          key="favicon-180"
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          key="favicon-32"
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          key="favicon-16"
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link key="manifest" rel="manifest" href="/site.webmanifest" />
      </Head>

      <Header
        titleContinuation={headerContinuation}
        navItems={[
          {
            title: "Blog",
            url: "/blog",
          },
          {
            title: "About",
            url: "/about",
          },
          {
            title: "Contact",
            url: "/contact",
          },
        ]}
      />

      {children}

      <Footer />
    </>
  );
};
