import { render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";

import EmptyState from "./EmptyState";
import ListContext from "./ListContext";

const initialContextValue = {
  error: false,
  loading: false,
  notes: [],
  totalNotes: 0,
  page: 1,
  query: "",
  lastSearchQuery: "",
  fetchNotes: jest.fn(),
  setLastSearchQuery: jest.fn(),
  setPage: jest.fn(),
  setQuery: jest.fn(),
  setLoading: jest.fn(),
};

describe("EmptyState", () => {
  it("should render and pass accessibility testing", async () => {
    const { container } = render(
      <ListContext.Provider value={initialContextValue}>
        <EmptyState />
      </ListContext.Provider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("should render an empty state message and create note link when there is no last search query", () => {
    const { getByText } = render(
      <ListContext.Provider value={initialContextValue}>
        <EmptyState />
      </ListContext.Provider>
    );
    expect(
      getByText("It doesn't look like you have any notes yet")
    ).toBeTruthy();
    expect(
      getByText("Create a new note").closest("a")?.getAttribute("href")
    ).toBe("/create");
  });

  it("should render an empty state message and clear search button when there is a last search query", async () => {
    const fetchNotes = jest.fn();
    const setQuery = jest.fn();
    const setLastSearchQuery = jest.fn();
    const { getByText } = render(
      <ListContext.Provider
        value={{
          ...initialContextValue,
          lastSearchQuery: "foo",
          fetchNotes,
          setQuery,
          setLastSearchQuery,
        }}
      >
        <EmptyState />
      </ListContext.Provider>
    );
    expect(
      getByText("We couldn't find any notes matching your search")
    ).toBeTruthy();
    expect(getByText("Clear search")).toBeTruthy();

    getByText("Clear search").click();
    expect(fetchNotes).toHaveBeenCalledWith({ nextPage: 1, nextQuery: "" });
    await waitFor(() => expect(setQuery).toHaveBeenCalledWith(""));
    await waitFor(() => expect(setLastSearchQuery).toHaveBeenCalledWith(""));
  });
});
