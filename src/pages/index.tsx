import { useRef } from "react";
import type { GetStaticProps } from "next";
import { Image } from "@/components/Image";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout, Wysiwyg } from "@/components";
import { useMatterGrid } from "@/hooks";

type WrapperRef = HTMLAnchorElement | HTMLDivElement | null;

const Home = ({ homePage, work }: HomeProps) => {
  const imageWrapperRefs = useRef<WrapperRef[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);
  const { engineRef } = useMatterGrid({
    imageWrapperRefs,
    mainRef,
    spacing: 200,
  });

  const router = useRouter();

  const clickThreshold = 5;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
    const endX = event.clientX;
    const endY = event.clientY;
    const deltaX = Math.abs(endX - startX);
    const deltaY = Math.abs(endY - startY);

    if (deltaX <= clickThreshold && deltaY <= clickThreshold) {
      void router.push(`/work/${slug}`);
    }
  };

  return (
    <Layout
      headerContinuation={homePage?.headerContinuation?.map((block) => (
        <Wysiwyg key={block._key} value={block} />
      ))}
      continuationClassName="lg:absolute"
      className="z-20"
      ref={mainRef}
      onTimeDoubleClick={() => {
        if (engineRef.current) {
          engineRef.current.gravity.y = 0.2;
        }
      }}
    >
      {work
        ?.filter(({ mainImage }) => mainImage)
        .map(({ _id, title, shortTitle, slug, notClickable, mainImage }, i) => {
          const Wrapper = notClickable ? "div" : "a";

          return (
            <Wrapper
              aria-label={notClickable ? undefined : title}
              className="blend-invert group mb-7 inline-flex w-full flex-col will-change-transform hover:z-10 hover:underline md:!max-w-[400px] notouch:absolute notouch:mb-0 notouch:max-w-[70vw] notouch:opacity-0 notouch:transition-opacity [&href]:cursor-pointer"
              href={notClickable ? undefined : `/work/${slug.current}`}
              key={_id}
              onClick={(e) => !notClickable && !isMobile && e.preventDefault()}
              onMouseDown={(e) =>
                !notClickable &&
                !isMobile &&
                handleMouseDown(e as React.MouseEvent<HTMLAnchorElement>)
              }
              onMouseUp={(e) =>
                !notClickable &&
                !isMobile &&
                handleMouseUp(
                  e as React.MouseEvent<HTMLAnchorElement>,
                  slug.current
                )
              }
              ref={(el: WrapperRef) => (imageWrapperRefs.current[i] = el)}
            >
              <Image
                alt=""
                blurDataURL={mainImage?.metadata?.lqip}
                className="pointer-events-none select-none object-cover grayscale  group-hover:grayscale-0"
                height={mainImage?.metadata?.dimensions?.height ?? 0}
                loading={i <= 3 ? "eager" : "lazy"}
                placeholder="blur"
                src={urlFor(mainImage)?.width(600).quality(85).url()}
                width={mainImage?.metadata?.dimensions?.width ?? 0}
              />
              <h4 className="mt-4 text-base group-hover:visible notouch:invisible">
                {shortTitle ?? title}
              </h4>
            </Wrapper>
          );
        })}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const homePage: HomeProps["homePage"] = await client.fetch(groq`
    *[_type == "homePage"][0] {
      headerContinuation,
    }
  `);

  const work: HomeProps["work"] = await client.fetch(groq`
    *[_type == "work"] {
      _id,
      title,
      shortTitle,
      notClickable,
      slug,
      mainImage{
        ...asset->
      }
    }
  `);

  return {
    props: {
      homePage,
      work,
    },
  };
};

export default Home;
