import {
  notesReducer,
  SetErrorAction,
  SetLoadingAction,
  SetNotesAction,
  SetPageAction,
  SetQueryAction,
} from "./ListContext";

const initialState = {
  error: false,
  loading: false,
  notes: [],
  totalNotes: 0,
  page: 1,
  query: "",
};

describe("notesReducer", () => {
  describe("when action type is setError", () => {
    it("should set error to true", () => {
      const action: SetErrorAction = {
        type: "setError",
      };

      expect(notesReducer(initialState, action)).toEqual({
        error: true,
        loading: false,
        notes: [],
        totalNotes: 0,
        page: 1,
        query: "",
      });
    });
  });

  describe("when action type is setLoading", () => {
    it("should set loading to the value of the action", () => {
      const action: SetLoadingAction = {
        type: "setLoading",
        loading: true,
      };

      expect(notesReducer(initialState, action)).toEqual({
        error: false,
        loading: true,
        notes: [],
        totalNotes: 0,
        page: 1,
        query: "",
      });
    });
  });

  describe("when action type is setNotes", () => {
    it("should set notes and totalNotes to the values of the action", () => {
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

      const action: SetNotesAction = {
        type: "setNotes",
        notes: [note],
        totalNotes: 1,
      };

      expect(notesReducer(initialState, action)).toEqual({
        error: false,
        loading: false,
        notes: [note],
        totalNotes: 1,
        page: 1,
        query: "",
      });
    });
  });

  describe("when action type is setPage", () => {
    it("should set page to the value of the action", () => {
      const action: SetPageAction = {
        type: "setPage",
        nextPage: 2,
      };

      expect(notesReducer(initialState, action)).toEqual({
        error: false,
        loading: false,
        notes: [],
        totalNotes: 0,
        page: 2,
        query: "",
      });
    });
  });
});
