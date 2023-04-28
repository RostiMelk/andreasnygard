import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import { StkBureau } from "@/styles/fonts";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-stk-bureau: ${StkBureau.style.fontFamily};
        }
      `}</style>

      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
