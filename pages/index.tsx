import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import Button from "@/components/Button";
import NotesList from "@/components/NotesList";
import { ServerError } from "@/lib/api/errors";
import getEmailFromSession from "@/lib/api/getEmailFromSession";
import getNotes from "@/lib/api/getNotes";
import { SerializedNote } from "@/types/Note";

const HomePage = ({
  notes,
  page,
  query,
  totalNotes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Notes</title>
      </Head>
      {!session ? (
        <div className="text-center">
          <p className="font-alt text-5xl mb-6">Looking for your notes?</p>
          <p className="text-xl mb-6">You&apos;ll need to sign in first</p>
          <Button className="mx-auto" onClick={() => signIn()}>
            Sign in
          </Button>
        </div>
      ) : (
        <>
          <p className="font-alt text-5xl mb-10 text-center">
            Welcome back, {session.user?.name}
          </p>

          <NotesList
            initialNotes={notes}
            initialPage={page}
            initialQuery={query}
            initialTotal={totalNotes}
          />
        </>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  notes: SerializedNote[];
  page: number;
  query: string;
  totalNotes: number;
}> = async ({ req, res, query }) => {
  try {
    const email = await getEmailFromSession(req, res);

    const page = parseInt((query.page as string) || "1", 10);
    const q = (query.q as string) || "";

    const { data, total } = await getNotes(email, page, q);

    // ObjectID's from MongoDB can't be serialized, so were convert
    // them to strings before returning props to the page
    const notes = data.map((note) => ({
      ...note,
      _id: note._id.toString(),
      user_id: note.user_id.toString(),
    }));

    return {
      props: {
        notes,
        page: page,
        query: q,
        totalNotes: total,
      },
    };
  } catch (e: any) {
    // If the user is not authenticated, return an empty notes list
    if (e instanceof ServerError && e.statusCode === 401) {
      return {
        props: {
          notes: [],
          page: 1,
          query: "",
          totalNotes: 0,
        },
      };
    }

    // Otherwise, re-throw error to show the `/pages/500.tsx` page
    throw new Error(e.message || "Internal Server Error");
  }
};

export default HomePage;
