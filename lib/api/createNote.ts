import { ServerError } from "@/lib/api/errors";
import getUser from "@/lib/api/getUser";
import clientPromise from "@/lib/mongodb";
import type Note from "@/types/Note";

const createNote = async (email: string, title?: string, content?: string) => {
  if (!title || !content) {
    throw new ServerError(
      400,
      "Bad Request - missing note title and / or content"
    );
  }

  const client = await clientPromise;
  const user = await getUser(email);
  const notesCollection = client.db(process.env.DB_NAME).collection("notes");

  const note: Omit<Note, "_id"> = {
    user_id: user._id,
    title,
    content,
    created_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
    is_deleted: false,
    deleted_at: null,
  };

  const response = await notesCollection.insertOne(note);

  return response;
};

export default createNote;
