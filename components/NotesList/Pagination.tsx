import { useCallback, useContext } from "react";

import Button from "@/components/Button";

import ListContext, { PAGE_SIZE } from "./ListContext";

const Pagination = () => {
  const { page, totalNotes, setPage, loading, fetchNotes } =
    useContext(ListContext);
  const totalPages = Math.ceil(totalNotes / PAGE_SIZE);

  const handlePrevPage = useCallback(async () => {
    const nextPage = page - 1;
    await fetchNotes({ nextPage });
    setPage(nextPage);
  }, [page, setPage, fetchNotes]);

  const handleNextPage = useCallback(async () => {
    const nextPage = page + 1;
    await fetchNotes({ nextPage });
    setPage(nextPage);
  }, [page, setPage, fetchNotes]);

  return (
    <div className="flex justify-between text-xl w-full">
      <div>
        {page > 1 && (
          <Button disabled={loading} onClick={handlePrevPage} size="small">
            ← Prev
          </Button>
        )}
      </div>
      <div>
        {page < totalPages && (
          <Button disabled={loading} onClick={handleNextPage} size="small">
            Next →
          </Button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
