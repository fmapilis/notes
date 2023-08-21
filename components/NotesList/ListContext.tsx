import { createContext } from "react";

import { SerializedNote } from "@/types/Note";

export const PAGE_SIZE = 10;

type SetError = {
  type: "setError";
};

type SetLoadingAction = {
  type: "setLoading";
  loading: boolean;
};

type SetNotesAction = {
  type: "setNotes";
  notes: SerializedNote[];
  totalNotes: number;
};

type SetPageAction = {
  type: "setPage";
  nextPage: number;
};

type SetQueryAction = {
  type: "setQuery";
  query: string;
};

type NotesAction =
  | SetError
  | SetLoadingAction
  | SetNotesAction
  | SetPageAction
  | SetQueryAction;

type NotesState = {
  error: boolean;
  loading: boolean;
  notes: SerializedNote[];
  totalNotes: number;
  page: number;
  query: string;
};

export const notesReducer = (state: NotesState, action: NotesAction) => {
  switch (action.type) {
    case "setError":
      return { ...state, error: true };

    case "setLoading":
      return { ...state, loading: action.loading };

    case "setNotes":
      return {
        ...state,
        notes: action.notes,
        totalNotes: action.totalNotes,
      };

    case "setPage":
      return {
        ...state,
        page: action.nextPage,
      };

    case "setQuery":
      return {
        ...state,
        page: 1,
        query: action.query,
      };

    default:
      return state;
  }
};

type ContextValues = NotesState & {
  setLoading: (loading: boolean) => void;
  setPage: (nextPage: number) => void;
  setQuery: (query: string) => void;
  fetchNotes: ({
    nextPage,
    nextQuery,
  }: {
    nextPage?: number;
    nextQuery?: string;
  }) => Promise<void>;
};

const defaultValues = {
  error: false,
  loading: false,
  totalNotes: 0,
  notes: [],
  page: 1,
  query: "",
  setLoading: () => {},
  setPage: () => {},
  setQuery: () => {},
  fetchNotes: () => Promise.resolve(),
};

export default createContext<ContextValues>(defaultValues);
