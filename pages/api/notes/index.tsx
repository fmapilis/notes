import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";
import type Note from "@/types/Note";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.method === "POST") {
    createNote(session, req, res);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
}

async function createNote(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      res
        .status(401)
        .json({ error: "Bad Request - Missing notes content or title" });
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

    const note: Omit<Note, "_id"> = {
      user_id: user._id,
      title,
      content,
      created_at: new Date().toISOString(),
      last_updated_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null,
    };

    await notesCollection.insertOne(note);

    res.status(200).json(note);
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
}
