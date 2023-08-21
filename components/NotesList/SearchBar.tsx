import { ChangeEvent, useCallback, useContext } from "react";

import Button from "@/components/Button";

import ListContext from "./ListContext";

const Searchbar = () => {
  const { query, setQuery, fetchNotes } = useContext(ListContext);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [setQuery]
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      await fetchNotes({ nextQuery: query });
    },
    [fetchNotes, query]
  );

  return (
    <form
      className="flex flex-col md:flex-row items-center mb-8 justify-between"
      onSubmit={handleSearch}
    >
      <input
        className="border border-sage px-4 py-2 w-full grow"
        type="search"
        placeholder="Search for a note"
        value={query}
        onChange={handleInputChange}
      />
      <div className="flex mt-4 md:mt-0 shrink-0">
        <Button className="md:ml-4" size="small" type="submit">
          Search
        </Button>
        <Button className="ml-4" href="/create" size="small">
          New note
        </Button>
      </div>
    </form>
  );
};

export default Searchbar;
