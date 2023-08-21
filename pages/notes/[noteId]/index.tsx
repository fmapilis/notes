import { marked } from "marked";
import { ObjectId } from "mongodb";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";

import Button from "@/components/Button";
import { ServerError } from "@/lib/api/errors";
import getEmailFromSession from "@/lib/api/getEmailFromSession";
import getNote from "@/lib/api/getNote";
import timeAgo from "@/lib/timeAgo";
import type { SerializedNote } from "@/types/Note";

const ViewNotePage = ({
  note,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useSession({ required: true });

  const {
    push,
    query: { noteId },
  } = useRouter();
  const lastUpdatedAt = useMemo(
    () => note && timeAgo(note.last_updated_at),
    [note]
  );

  const handleDelete = useCallback(async () => {
    if (noteId) {
      try {
        if (!confirm("Are you sure you want to delete this note?")) {
          return;
        }

        const response = await fetch(`/api/notes/${noteId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        push("/");
      } catch (e) {
        console.error(e);
        alert("There was an unexpected error deleting your note");
      }
    }
  }, [noteId, push]);

  return (
    <>
      <Head>
        <title>Note - {note.title}</title>
      </Head>

      <div className="flex items-start justify-end">
        <Button href={`/notes/${note._id}/edit`} size="small">
          Edit note
        </Button>
        <Button
          className="ml-4"
          onClick={handleDelete}
          size="small"
          variant="secondary"
        >
          Delete note
        </Button>
      </div>

      <article>
        <header className="mb-6">
          <h1 className="font-alt text-5xl">{note.title}</h1>
          {lastUpdatedAt && (
            <p className="mt-2 text-green text-sm italic">{`Last updated ${lastUpdatedAt}`}</p>
          )}
        </header>
        {/*
        This method of rendering Markdown is potentially unsafe, as we are not
        sanitizing the content client-side or server-side. I've opted not to
        do this for the sake of a demo, but ideally this content should be
        sanitized before being rendered.
      */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: marked(note.content, { gfm: true, breaks: true }),
          }}
        />
      </article>
    </>
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
    const email = await getEmailFromSession(req, res);

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

export default ViewNotePage;
