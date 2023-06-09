import React from "react";
import Link from "next/link";

import type { MenuItem } from "@/types";

interface Props {
  navItems?: MenuItem[];
  /**
   * The text that comes after "ANDREAS NYGÅRD".
   *
   * Example: ANDREAS NYGÅRD is a ...
   */
  titleContinuation?: React.ReactNode;
}

export const Header = ({ navItems, titleContinuation }: Props) => {
  const title = "ANDREAS NYGÅRD";

  return (
    <>
      <header className="two-col blend-invert container fixed top-7 z-10">
        <h1 className="text-base">
          <Link className="hover:underline" href="/">
            {title}
          </Link>
        </h1>

        <nav>
          <ul className="flex justify-between">
            {navItems?.map((item, i) => (
              <li key={i}>
                <Link
                  className="text-base hover:underline"
                  href={item.url}
                  target={item.newTab ? "_blank" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {titleContinuation && (
        <p className="container absolute m-0 mt-7 w-1/2 text-base">
          <span className="invisible">{title}</span> {titleContinuation}
        </p>
      )}
    </>
  );
};
