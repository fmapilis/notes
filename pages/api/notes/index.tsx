import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api//auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
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
  res: NextApiResponse,
) {
  try {
    if (!req.body.content || !req.body.title) {
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

    const note = {
      user_id: user._id,
      title: req.body.title,
      content: req.body.content,
      created_at: new Date().toISOString(),
    };

    await notesCollection.insertOne(note);

    res.status(200).json(note);
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
}
