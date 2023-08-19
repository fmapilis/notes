import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Note from "@/types/Note";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const noteId = req.query.noteId as string;

    if (ObjectId.isValid(noteId) === false) {
      res.status(400).json({ error: "Bad Request - Invalid noteId" });
      return;
    }

    const noteObjectId = new ObjectId(req.query.noteId as string);
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const client = await clientPromise;
    const usersCollection = client.db(process.env.DB_NAME).collection("users");
    const email = session?.user?.email?.toLowerCase();
    const user = await usersCollection.findOne({ email });

    if (!user) {
      res.status(500).json({ error: "Invalid user" });
      return;
    }

    const notesCollection = client.db(process.env.DB_NAME).collection("notes");

    const note = (await notesCollection.findOne({
      _id: noteObjectId,
      is_deleted: false,
    })) as Note | null;

    if (!note) {
      res.status(404).json({ error: "Not Found" });
      return;
    } else if (!note.user_id.equals(user._id)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (req.method === "GET") {
      getNote(note, res);
    } else if (req.method === "PATCH") {
      updateNote(note, req, res);
    } else if (req.method === "DELETE") {
      deleteNote(note, res);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unexpected error" });
  }
}

async function getNote(note: Note, res: NextApiResponse) {
  res.status(200).json(note);
}

async function updateNote(
  note: Note,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, content } = req.body;
  if (!title || !content) {
    res
      .status(401)
      .json({ error: "Bad Request - Missing notes content or title" });
    return;
  }

  const client = await clientPromise;
  const notesCollection = client.db(process.env.DB_NAME).collection("notes");

  const updatedNote = await notesCollection.updateOne(
    { _id: note._id },
    {
      $set: {
        title,
        content,
        last_updated_at: new Date().toISOString(),
      },
    }
  );

  res.status(200).json(updatedNote);
}

async function deleteNote(note: Note, res: NextApiResponse) {
  const client = await clientPromise;
  const notesCollection = client.db(process.env.DB_NAME).collection("notes");

  await notesCollection.updateOne(
    { _id: note._id },
    { $set: { is_deleted: true, deleted_at: new Date().toISOString() } }
  );

  res.status(200).json({ success: true });
}
