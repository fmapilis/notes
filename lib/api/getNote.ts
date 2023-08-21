import { ObjectId } from "mongodb";

import { ServerError } from "@/lib/api/errors";
import getUser from "@/lib/api/getUser";
import clientPromise from "@/lib/mongodb";
import type Note from "@/types/Note";

const getNotes = async (email: string, noteObjectId: ObjectId) => {
  const client = await clientPromise;
  const user = await getUser(email);

  const notesCollection = client.db(process.env.DB_NAME).collection("notes");
  const note = (await notesCollection.findOne({
    _id: noteObjectId,
    is_deleted: false,
  })) as Note | null;

  if (!note) {
    throw new ServerError(404, "Note not found");
  } else if (!note.user_id.equals(user._id)) {
    throw new ServerError(401, "Unauthorized");
  }

  return note;
};

export default getNotes;
