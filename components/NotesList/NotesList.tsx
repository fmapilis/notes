import { useCallback, useReducer } from "react";

import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { SerializedNote } from "@/types/Note";

import ListContext, { notesReducer } from "./ListContext";
import NoteCard from "./NoteCard";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

const NotesList = ({
  initialNotes,
  initialPage = 1,
  initialQuery = "",
  initialTotal,
}: {
  initialNotes: SerializedNote[];
  initialPage?: number;
  initialQuery?: string;
  initialTotal: number;
}) => {
  const [notesState, dispatch] = useReducer(notesReducer, {
    error: false,
    loading: false,
    notes: initialNotes || [],
    totalNotes: initialTotal,
    page: initialPage,
    query: initialQuery,
  });

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: "setLoading", loading });
    },
    [dispatch]
  );

  const fetchNotes = useCallback(
    async ({
      nextPage,
      nextQuery,
    }: {
      nextPage?: number;
      nextQuery?: string;
    }) => {
      try {
        setLoading(true);

        const { page, query } = notesState;
        const searchQuery = {
          page: (nextPage || page).toString(),
          query: typeof nextQuery !== "undefined" ? nextQuery : query,
        };

        const response = await fetch(
          `/api/notes?${new URLSearchParams(searchQuery).toString()}`
        );
        const responseData = await response.json();

        if (responseData.error) {
          throw new Error(responseData.error);
        }

        dispatch({
          type: "setNotes",
          notes: responseData.data,
          totalNotes: responseData.total,
        });
      } catch (e) {
        console.error(e);
        dispatch({ type: "setError" });
      } finally {
        setLoading(false);
      }
    },
    [notesState, setLoading]
  );

  const setPage = useCallback(
    async (nextPage: number) => {
      dispatch({ type: "setPage", nextPage });
    },
    [dispatch]
  );

  const setQuery = useCallback(
    async (query: string) => {
      dispatch({ type: "setQuery", query });
    },
    [dispatch]
  );

  const { notes, loading } = notesState;

  if (!notes.length) {
    <>
      <p className="text-xl mb-6">You don&apos;t have any saved notes yet</p>
      <Button className="mx-auto" href="/create">
        Create a new note
      </Button>
    </>;
  }

  return (
    <ListContext.Provider
      value={{ ...notesState, setLoading, setPage, setQuery, fetchNotes }}
    >
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative">
        {notes.map((note) => (
          <NoteCard key={note._id.toString()} note={note} />
        ))}
        {loading && (
          <div className="absolute flex top-8 w-full">
            <Spinner size={128} className="text-green m-auto" />
          </div>
        )}
      </div>
      <Pagination />
    </ListContext.Provider>
  );
};

export default NotesList;
