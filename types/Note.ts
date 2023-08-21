import { ObjectId } from "mongodb";

type Note = {
  _id: ObjectId;
  user_id: ObjectId;
  title: string;
  content: string;
  created_at: string;
  last_updated_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
};

export type SerializedNote = { _id: string; user_id: string } & Omit<
  Note,
  "_id" | "user_id"
>;

export default Note;
