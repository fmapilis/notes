import "@/styles/globals.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import Layout from "@/components/Layout";

type NotesAppProps<P = {}> = AppProps<P> & {
  Component: NextPage<P>;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: NotesAppProps<{ session?: Session }>) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default App;
