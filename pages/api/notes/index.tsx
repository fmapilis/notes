import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";

import escapeRegex from "@/lib/escapeRegex";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
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

  if (req.method === "GET") {
    getAllNotes(session, req, res);
  } else if (req.method === "POST") {
    createNote(session, req, res);
  } else {
    res.status(404).json({ error: "Not Found" });
  }
}

async function getAllNotes(
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = parseInt(req.query.skip as string) || 0;
    const query = req.query.query as string;

    const client = await clientPromise;
    const usersCollection = client.db(process.env.DB_NAME).collection("users");
    const email = session?.user?.email?.toLowerCase();
    const user = await usersCollection.findOne({ email });

    if (!user) {
      res.status(500).json({ error: "Invalid user" });
      return;
    }

    const notesCollection = client.db(process.env.DB_NAME).collection("notes");

    // This is not a particularly performant search, since it's doing a simple
    // regex match on `content` and doesn't take advantage of MongoDB's text
    // indices, but it allows for partial text matches. A more robust aggregation
    // solution would probably need to be implemented for a large-scale
    // application.
    const result = await notesCollection
      .aggregate([
        {
          $match: {
            user_id: user._id,
            is_deleted: false,
            ...(query && { content: new RegExp(escapeRegex(query), "i") }),
          },
        },
        {
          $facet: {
            data: [
              {
                $sort: { last_updated_at: -1 },
              },
              { $skip: skip },
              { $limit: limit },
            ],
            total: [{ $count: "count" }],
          },
        },
      ])
      .toArray();

    res
      .status(200)
      .json({ data: result[0].data, total: result[0].total[0]?.count || 0 });
  } catch (error: unknown) {
    res.status(500).json({ error });
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
