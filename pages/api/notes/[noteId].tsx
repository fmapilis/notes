import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

import deleteNote from "@/lib/api/deleteNote";
import { errorHandler, ServerError } from "@/lib/api/errors";
import getEmailFromSession from "@/lib/api/getEmailFromSession";
import getNote from "@/lib/api/getNote";
import updateNote from "@/lib/api/updateNote";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const noteId = req.query.noteId as string;

    if (ObjectId.isValid(noteId) === false) {
      throw new ServerError(400, "Invalid Note ID");
    }

    const noteObjectId = new ObjectId(req.query.noteId as string);
    const email = await getEmailFromSession(req, res);

    if (req.method === "GET") {
      const note = await getNote(email, noteObjectId);

      res.status(200).json(note);
    } else if (req.method === "PATCH") {
      const note = await updateNote(
        noteObjectId,
        req.body.title,
        req.body.content
      );

      res.status(200).json(note);
    } else if (req.method === "DELETE") {
      await deleteNote(noteObjectId);

      res.status(200).json({ success: true });
    } else {
      throw new ServerError(404, "Not Found");
    }
  } catch (e) {
    errorHandler(e, res);
  }
}
