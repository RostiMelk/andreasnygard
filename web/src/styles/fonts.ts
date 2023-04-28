import localFont from "@next/font/local";

export const StkBureau = localFont({
  src: [
    {
      path: "../../public/fonts/stk-bureau/sans-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/stk-bureau/sans-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
});
