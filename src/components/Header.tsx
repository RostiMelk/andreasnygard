import React from "react";
import Link from "next/link";
import clsx from "@/lib/clsx";
import type { MenuItem } from "@/types";

interface Props {
  navItems?: MenuItem[];
  /**
   * The text that comes after "ANDREAS NYGÅRD".
   *
   * Example: ANDREAS NYGÅRD is a ...
   */
  titleContinuation?: React.ReactNode;
  continuationClassName?: string;
  hideNav?: boolean;
  hideTitle?: boolean;
}

export const Header = ({
  navItems,
  titleContinuation,
  continuationClassName,
  hideNav,
  hideTitle,
}: Props) => {
  const title = "ANDREAS NYGÅRD";

  return (
    <>
      <header
        className={clsx(
          "blend-invert container fixed z-10 lg:top-8 lg:text-left",
          {
            "top-8 text-right": !titleContinuation,
            "top-20 text-left": titleContinuation,
            "lg:two-col": !hideNav,
          }
        )}
      >
        {!hideTitle && (
          <h1 className="text-base">
            <Link className="hover:underline" href="/">
              {title}
            </Link>
          </h1>
        )}

        {/* Desktop navigation */}
        {!hideNav && (
          <Navigation className="hidden lg:flex" navItems={navItems} />
        )}
      </header>

      {/* Mobile navigation */}
      {!hideNav && (
        <Navigation
          className="blend-invert container fixed bottom-8 z-50 w-full lg:hidden"
          navItems={navItems}
        />
      )}

      {titleContinuation && (
        <span
          className={clsx(
            "container m-0 mb-11 mt-20 block text-base lg:mt-8 [&>p:nth-child(2)]:inline",
            continuationClassName,
            { "lg:w-1/3": !hideNav }
          )}
        >
          {!hideTitle && <span className="invisible">{title + " "}</span>}
          {titleContinuation}
        </span>
      )}
    </>
  );
};

const Navigation = ({
  className,
  navItems,
}: {
  className?: string;
  navItems?: MenuItem[];
}) => (
  <nav className="col-span-2 col-start-2">
    <ul className={clsx("flex justify-between", className)}>
      {navItems?.map((item, i) => (
        <li key={i} className="[&>a]:first:pl-0 [&>a]:last:pr-0">
          <Link
            className="p-5 text-base hover:underline lg:p-0"
            href={item.url}
            target={item.newTab ? "_blank" : undefined}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
