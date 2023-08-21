import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import Spinner from "@/components/Spinner";
import TextEditor from "@/components/TextEditor";
import type Note from "@/types/Note";

const EditNotePage = () => {
  useSession({ required: true });

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {
    push,
    query: { noteId },
  } = useRouter();

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

  if (error) {
    return (
      <>
        <Head>
          <title>Edit - Error</title>
        </Head>
        <div>Error loading note</div>
      </>
    );
  }

  if (loading || !note) {
    return (
      <>
        <Head>
          <title>Edit - Loading...</title>
        </Head>
        <Spinner size={128} className="text-green m-auto" />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Edit - {note.title}</title>
      </Head>
      <TextEditor
        onSave={handleUpdateNote}
        initialTitle={note.title}
        initialContent={note.content}
      />
    </>
  );
};

export default EditNotePage;
