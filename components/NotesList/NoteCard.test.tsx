import { render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";

import ListContext from "./ListContext";
import NoteCard from "./NoteCard";

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

const note = {
  _id: "foo",
  user_id: "bar",
  title: "Title",
  content: "Content",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
  deleted_at: null,
  last_updated_at: new Date().toISOString(),
};

describe("NoteCard", () => {
  it("should render and pass accessibility testing", async () => {
    const { container } = render(
      <ListContext.Provider value={initialContextValue}>
        <NoteCard note={note} />
      </ListContext.Provider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("should render the title", () => {
    const { getByText } = render(
      <ListContext.Provider value={initialContextValue}>
        <NoteCard note={note} />
      </ListContext.Provider>
    );
    expect(getByText("Title")).toBeTruthy();
  });

  it("should render links and buttons", () => {
    const { getByText } = render(
      <ListContext.Provider value={initialContextValue}>
        <NoteCard note={note} />
      </ListContext.Provider>
    );
    expect(getByText("View").closest("a")?.getAttribute("href")).toBe(
      `/notes/${note._id}`
    );
    expect(getByText("Edit").closest("a")?.getAttribute("href")).toBe(
      `/notes/${note._id}/edit`
    );
    expect(getByText("Delete")).toBeTruthy();
  });

  it("should show a confirm dialog when the delete button is clicked", () => {
    global.confirm = jest.fn();

    const { getByText } = render(
      <ListContext.Provider value={initialContextValue}>
        <NoteCard note={note} />
      </ListContext.Provider>
    );
    getByText("Delete").click();

    expect(global.confirm).toHaveBeenCalledWith(
      `Are you sure you want to delete "${note.title}"?`
    );
  });

  it("should attempt to delete the note when the delete button is clicked and the user confirms", async () => {
    global.confirm = jest.fn(() => true);
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ success: true }) })
    ) as jest.Mock;
    const fetchNotesMock = jest.fn();

    const { getByText } = render(
      <ListContext.Provider
        value={{ ...initialContextValue, fetchNotes: fetchNotesMock }}
      >
        <NoteCard note={note} />
      </ListContext.Provider>
    );
    getByText("Delete").click();

    expect(global.fetch).toHaveBeenCalledWith(`/api/notes/${note._id}`, {
      method: "DELETE",
    });
    await waitFor(() =>
      expect(fetchNotesMock).toHaveBeenCalledWith({ nextPage: 1 })
    );
  });
});
