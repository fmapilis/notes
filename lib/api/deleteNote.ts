import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

const deleteNote = async (noteObjectId: ObjectId) => {
  const client = await clientPromise;
  const notesCollection = client.db(process.env.DB_NAME).collection("notes");

  await notesCollection.updateOne(
    { _id: noteObjectId },
    { $set: { is_deleted: true, deleted_at: new Date().toISOString() } }
  );
};

export default deleteNote;
