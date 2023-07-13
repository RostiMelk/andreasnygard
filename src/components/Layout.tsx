import Head from "next/head";
import React from "react";
import clsx from "@/lib/clsx";

import { Header, Footer } from "@/components";

interface Props {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  headerContinuation?: React.ReactNode;
  continuationClassName?: string;
  onTimeDoubleClick?: () => void;
}

export const Layout = React.forwardRef<HTMLDivElement, Props>(function Layout(
  {
    title,
    description,
    className,
    children,
    headerContinuation,
    continuationClassName,
    onTimeDoubleClick,
  }: Props,
  ref: React.Ref<HTMLDivElement>
) {
  /**
   * Meta tags:
   */
  title = title ? `${title} | Andreas Nygård` : "Andreas Nygård";
  description =
    description ||
    "Andreas Nygård is a graphic designer, based in Oslo, Norway. He believes good design (whatever that means) can be a force for change, and bring people closer to each other.";

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
      </Head>

      <Header
        titleContinuation={headerContinuation}
        continuationClassName={continuationClassName}
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

      <main className={clsx("container mb-20 w-screen", className)} ref={ref}>
        {children}
      </main>

      <Footer onTimeDoubleClick={onTimeDoubleClick} />
    </>
  );
});
