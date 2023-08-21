import cx from "classnames";
import { useCallback, useContext, useMemo } from "react";

import Button from "@/components/Button";
import timeAgo from "@/lib/timeAgo";
import { SerializedNote } from "@/types/Note";

import ListContext from "./ListContext";

const NoteCard = ({ note }: { note: SerializedNote }) => {
  const { fetchNotes, loading } = useContext(ListContext);
  const lastUpdatedAt = useMemo(
    () => note && timeAgo(note.last_updated_at),
    [note]
  );

  const handleDelete = useCallback(async () => {
    try {
      if (!confirm(`Are you sure you want to delete "${note.title}"?`)) {
        return;
      }

      const response = await fetch(`/api/notes/${note._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      await fetchNotes({ nextPage: 1 });
    } catch (e) {
      console.error(e);
      alert("There was an unexpected error deleting your note");
    }
  }, [note, fetchNotes]);

  return (
    <div
      className={cx("border-sage border-2 p-4 rounded-xl shadow-sm", {
        "opacity-50": loading,
      })}
    >
      <p className="font-alt text-2xl truncate w-full border-b border-sage">
        {note.title}
      </p>

      {lastUpdatedAt && (
        <p className="mt-2 text-green text-xs italic">{`Last updated ${lastUpdatedAt}`}</p>
      )}

      <div className="flex items-start justify-end mt-8">
        <Button disabled={loading} href={`/notes/${note._id}`} size="small">
          View
        </Button>
        <Button
          disabled={loading}
          className="ml-2"
          href={`/notes/${note._id}/edit`}
          size="small"
        >
          Edit
        </Button>
        <Button
          disabled={loading}
          className="ml-2"
          onClick={handleDelete}
          size="small"
          variant="secondary"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default NoteCard;
