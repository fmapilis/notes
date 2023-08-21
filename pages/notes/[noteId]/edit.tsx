import { ObjectId } from "mongodb";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

import { ServerError } from "@/lib/api/errors";
import getNote from "@/lib/api/getNote";
import getUserFromSession from "@/lib/api/getUserFromSession";
import { SerializedNote } from "@/types/Note";

const TextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

const EditNotePage = ({
  note,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useSession({ required: true });

  const {
    push,
    query: { noteId },
  } = useRouter();

  const handleUpdateNote = useCallback(
    async (title: string, markdown: string) => {
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content: markdown }),
        });
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        push(`/notes/${data.value._id}`);
      } catch (e) {
        alert("There was an unexpected issue updating your note");
        console.error(e);
      }
    },
    [push, noteId]
  );

  return (
    <div className="h-[calc(100vh-var(--header-height)-4rem)]">
      <Head>
        <title>Edit - {note.title}</title>
      </Head>
      <TextEditor
        onSave={handleUpdateNote}
        initialTitle={note.title}
        initialContent={note.content}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  note: SerializedNote;
}> = async ({ req, res, params }) => {
  try {
    if (!params?.noteId) {
      throw new ServerError(400, "Invalid Note ID");
    }

    const noteObjectId = new ObjectId(params.noteId as string);
    const { email } = await getUserFromSession(req, res);

    // ObjectID's from MongoDB can't be serialized, so were convert
    // them to strings before returning props to the page
    const { _id, user_id, ...restNote } = await getNote(email, noteObjectId);
    return {
      props: {
        note: { _id: _id.toString(), user_id: user_id.toString(), ...restNote },
      },
    };
  } catch (e: any) {
    if (e instanceof ServerError && e.statusCode === 404) {
      return {
        notFound: true,
      };
    }

    // Re-throw error to show the `/pages/500.tsx` page
    throw new Error(e.message || "Internal Server Error");
  }
};

export default EditNotePage;
