import { render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";

import ListContext, { PAGE_SIZE } from "./ListContext";
import Pagination from "./Pagination";

const initialContextValue = {
  error: false,
  loading: false,
  notes: [],
  totalNotes: 30,
  page: 2,
  query: "",
  fetchNotes: jest.fn(),
  setPage: jest.fn(),
  setQuery: jest.fn(),
  setLoading: jest.fn(),
};

describe("Pagination", () => {
  it("should render and pass accessibility testing", async () => {
    const { container } = render(
      <ListContext.Provider value={initialContextValue}>
        <Pagination />
      </ListContext.Provider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("should render the prev button when page > 1", () => {
    const { getByText } = render(
      <ListContext.Provider value={{ ...initialContextValue, page: 2 }}>
        <Pagination />
      </ListContext.Provider>
    );
    expect(getByText("← Prev")).toBeTruthy();
  });

  it("should hide the prev button when page <= 1", () => {
    const { queryByText } = render(
      <ListContext.Provider value={{ ...initialContextValue, page: 1 }}>
        <Pagination />
      </ListContext.Provider>
    );
    expect(queryByText("← Prev")).toBeNull();
  });

  it("should call fetchNotes and setPage when clicking prev button", async () => {
    const fetchNotes = jest.fn();
    const setPage = jest.fn();
    const { getByText } = render(
      <ListContext.Provider
        value={{ ...initialContextValue, fetchNotes, setPage }}
      >
        <Pagination />
      </ListContext.Provider>
    );
    getByText("← Prev").click();
    expect(fetchNotes).toHaveBeenCalledWith({ nextPage: 1 });
    await waitFor(() => expect(setPage).toHaveBeenCalledWith(1));
  });

  it("should render the next button when not on last page", () => {
    const { getByText } = render(
      <ListContext.Provider
        value={{ ...initialContextValue, page: 1, totalNotes: PAGE_SIZE * 2 }}
      >
        <Pagination />
      </ListContext.Provider>
    );
    expect(getByText("Next →")).toBeTruthy();
  });

  it("should hide the next button when on last page", () => {
    const { queryByText } = render(
      <ListContext.Provider
        value={{ ...initialContextValue, page: 2, totalNotes: PAGE_SIZE * 2 }}
      >
        <Pagination />
      </ListContext.Provider>
    );
    expect(queryByText("Next →")).toBeNull();
  });

  it("should call fetchNotes and setPage when clicking next button", async () => {
    const fetchNotes = jest.fn();
    const setPage = jest.fn();
    const { getByText } = render(
      <ListContext.Provider
        value={{
          ...initialContextValue,
          fetchNotes,
          setPage,
          page: 1,
          totalNotes: PAGE_SIZE * 2,
        }}
      >
        <Pagination />
      </ListContext.Provider>
    );
    getByText("Next →").click();
    expect(fetchNotes).toHaveBeenCalledWith({ nextPage: 2 });
    await waitFor(() => expect(setPage).toHaveBeenCalledWith(2));
  });
});
