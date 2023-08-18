import "@/styles/globals.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import Layout from "@/components/Layout";
import Auth from "@/components/Auth";

type Page<P = {}, IP = P> = NextPage<P, IP> & {
  requireSession?: boolean;
};

type NotesAppProps<P = {}> = AppProps<P> & {
  Component: Page<P>;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: NotesAppProps<{ session?: Session }>) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.requireSession ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  );
};

export default App;
