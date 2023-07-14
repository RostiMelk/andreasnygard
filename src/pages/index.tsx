import { useRef } from "react";
import type { GetStaticProps } from "next";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

import type { HomeProps } from "./types";
import { client, groq, urlFor } from "@/lib/sanity.client";
import { Layout, Wysiwyg } from "@/components";
import { useMatterGrid } from "@/hooks";

const Home = ({ homePage, work }: HomeProps) => {
  const imageWrapperRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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
      {work?.map(
        ({ _id, title, shortTitle, slug, notClickable, mainImage }, index) => {
          return (
            <a
              onMouseDown={(e) =>
                !notClickable && !isMobile && handleMouseDown(e)
              }
              onMouseUp={(e) =>
                !notClickable && !isMobile && handleMouseUp(e, slug.current)
              }
              key={_id}
              className="blend-invert group mb-7 inline-flex w-full cursor-pointer flex-col will-change-transform hover:z-10 hover:underline lg:absolute lg:mb-0 lg:max-w-[400px] lg:opacity-0 lg:transition-opacity"
              ref={(el) => (imageWrapperRefs.current[index] = el)}
              onClick={(e) => !isMobile && e.preventDefault()}
              href={notClickable ? undefined : `/work/${slug.current}`}
            >
              <Image
                alt=""
                blurDataURL={urlFor(mainImage).width(50).url()}
                className="pointer-events-none select-none object-cover grayscale  group-hover:grayscale-0"
                height={mainImage?.metadata?.dimensions?.height ?? 0}
                placeholder="blur"
                quality={60}
                sizes="100vw"
                src={urlFor(mainImage)?.url() ?? ""}
                width={mainImage?.metadata?.dimensions?.width ?? 0}
              />
              <h4 className="mt-4 text-base group-hover:visible lg:invisible">
                {shortTitle ?? title}
              </h4>
            </a>
          );
        }
      )}
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
