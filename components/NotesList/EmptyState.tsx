import { useCallback, useContext } from "react";

import Button from "@/components/Button";

import ListContext from "./ListContext";

const EmptyState = () => {
  const { lastSearchQuery, setQuery, setLastSearchQuery, fetchNotes } =
    useContext(ListContext);

  const handleClearSearch = useCallback(async () => {
    await fetchNotes({ nextPage: 1, nextQuery: "" });
    setQuery("");
    setLastSearchQuery("");
  }, [setQuery, setLastSearchQuery, fetchNotes]);

  if (lastSearchQuery) {
    return (
      <div className="text-center w-full">
        <h1 className="text-2xl mb-6">
          We couldn&apos;t find any notes matching your search
        </h1>
        <Button className="text-xl mb-6 m-auto" onClick={handleClearSearch}>
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center w-full">
      <h1 className="text-2xl mb-6">
        It doesn&apos;t look like you have any notes yet
      </h1>
      <Button className="text-xl mb-6 m-auto" href="/create">
        Create a new note
      </Button>
    </div>
  );
};

export default EmptyState;
