import { marked } from "marked";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import timeAgo from "@/lib/timeAgo";
import type Note from "@/types/Note";

const ViewNotePage = () => {
  useSession({ required: true });

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {
    push,
    query: { noteId },
  } = useRouter();
  const lastUpdatedAt = useMemo(
    () => note && timeAgo(note.last_updated_at),
    [note]
  );

  useEffect(() => {
    if (noteId) {
      setLoading(true);
      fetch(`/api/notes/${noteId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 404) {
            throw new Error("Note not found");
          } else if (data.error) {
            throw new Error(data.error);
          }

          setNote(data);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setError(true);
          setLoading(false);
        });
    }
  }, [noteId]);

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

  if (error) {
    return (
      <>
        <Head>
          <title>Note - Error</title>
        </Head>
        <div>Error loading note</div>
      </>
    );
  }

  if (loading || !note) {
    return (
      <>
        <Head>
          <title>Note - Loading...</title>
        </Head>
        <Spinner size={128} className="text-green m-auto" />
      </>
    );
  }

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

export default ViewNotePage;
