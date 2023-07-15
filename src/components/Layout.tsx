import Head from "next/head";
import React from "react";
import clsx from "@/lib/clsx";

import { Header, Footer } from "@/components";

interface Props {
  children?: React.ReactNode;
  className?: string;
  continuationClassName?: string;
  description?: string;
  headerContinuation?: React.ReactNode;
  hideFooter?: boolean;
  hideNav?: boolean;
  hideTitle?: boolean;
  onTimeDoubleClick?: () => void;
  title?: string;
}

export const Layout = React.forwardRef<HTMLDivElement, Props>(function Layout(
  {
    children,
    className,
    continuationClassName,
    description,
    headerContinuation,
    hideFooter,
    hideNav,
    hideTitle,
    onTimeDoubleClick,
    title,
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
          key="favicon-sv"
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
        <link key="favicon" rel="icon" type="image/png" href="/favicon.png" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        <meta key="og:type" property="og:type" content="website" />
        <meta
          key="og:url"
          property="og:url"
          content="https://andreasnygard.no"
        />
        <meta
          key="og:image"
          property="og:image"
          content="https://andreasnygard.no/og-image.jpg"
        />
        <meta key="og:image:width" property="og:image:width" content="1600" />
        <meta key="og:image:height" property="og:image:height" content="900" />
        <meta
          key="og:image:alt"
          property="og:image:alt"
          content="Andreas Nygård"
        />
        <meta
          key="og:site_name"
          property="og:site_name"
          content="Andreas Nygård"
        />
        <meta
          key="twitter:card"
          property="twitter:card"
          content="summary_large_image"
        />
        <meta key="twitter:title" property="twitter:title" content={title} />
        <meta
          key="twitter:description"
          property="twitter:description"
          content={description}
        />
        <meta
          key="twitter:image"
          property="twitter:image"
          content="https://andreasnygard.no/og-image.jpg"
        />
        <meta
          key="twitter:image:alt"
          property="twitter:image:alt"
          content="Andreas Nygård"
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
        hideNav={hideNav}
        hideTitle={hideTitle}
      />

      <main className={clsx("container mb-20 w-screen", className)} ref={ref}>
        {children}
      </main>

      {!hideFooter && <Footer onTimeDoubleClick={onTimeDoubleClick} />}
    </>
  );
});
