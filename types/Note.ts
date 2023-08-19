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

export default Note;
