import { ObjectId } from "mongodb";

import { ServerError } from "@/lib/api/errors";
import clientPromise from "@/lib/mongodb";

const updateNote = async (
  noteObjectId: ObjectId,
  title?: string,
  content?: string
) => {
  if (!title || !content) {
    throw new ServerError(
      400,
      "Bad Request - missing note title and / or content"
    );
  }

  const client = await clientPromise;
  const notesCollection = client.db(process.env.DB_NAME).collection("notes");

  const updatedNote = await notesCollection.findOneAndUpdate(
    { _id: noteObjectId },
    {
      $set: {
        title,
        content,
        last_updated_at: new Date().toISOString(),
      },
    }
  );

  return updatedNote;
};

export default updateNote;
