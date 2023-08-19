import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Spinner from "@/components/Spinner";

import type Note from "@/types/Note";

const ViewNotePage = () => {
  useSession({ required: true });

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const {
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

  if (loading) {
    return <Spinner size={128} className="text-green m-auto" />;
  }

  if (error) {
    return <div>Error loading note</div>;
  }

  return <div>{JSON.stringify(note, null, 2)}</div>;
};

export default ViewNotePage;
