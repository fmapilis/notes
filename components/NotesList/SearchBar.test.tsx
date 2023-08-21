import { fireEvent, render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";

import ListContext from "./ListContext";
import SearchBar from "./SearchBar";

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

describe("SearchBar", () => {
  it("should render and pass accessibility testing", async () => {
    const { container } = render(
      <ListContext.Provider value={initialContextValue}>
        <SearchBar />
      </ListContext.Provider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("should render the search input", () => {
    const { getByPlaceholderText } = render(
      <ListContext.Provider value={initialContextValue}>
        <SearchBar />
      </ListContext.Provider>
    );
    expect(getByPlaceholderText("Search for a note")).toBeTruthy();
  });

  it("should call fetchNotes and setLastSearchQuery when submitting the form", async () => {
    const fetchNotes = jest.fn();
    const setLastSearchQuery = jest.fn();
    const { getByPlaceholderText } = render(
      <ListContext.Provider
        value={{ ...initialContextValue, fetchNotes, setLastSearchQuery }}
      >
        <SearchBar />
      </ListContext.Provider>
    );
    getByPlaceholderText("Search for a note").closest("form")?.submit();
    expect(fetchNotes).toHaveBeenCalledWith({ nextQuery: "" });
    await waitFor(() => expect(setLastSearchQuery).toHaveBeenCalledWith(""));
  });

  it("should update the query when typing", () => {
    const setQuery = jest.fn();
    const { getByPlaceholderText } = render(
      <ListContext.Provider value={{ ...initialContextValue, setQuery }}>
        <SearchBar />
      </ListContext.Provider>
    );
    const input = getByPlaceholderText("Search for a note");
    fireEvent.change(input, { target: { value: "foo" } });
    expect(setQuery).toHaveBeenCalledWith("foo");
  });

  it("should render a new note link", () => {
    const { getByText } = render(
      <ListContext.Provider value={initialContextValue}>
        <SearchBar />
      </ListContext.Provider>
    );
    expect(getByText("New note").closest("a")?.getAttribute("href")).toBe(
      "/create"
    );
  });
});
