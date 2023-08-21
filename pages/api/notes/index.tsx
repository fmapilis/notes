import { NextApiRequest, NextApiResponse } from "next";

import createNote from "@/lib/api/createNote";
import { errorHandler, ServerError } from "@/lib/api/errors";
import getEmailFromSession from "@/lib/api/getEmailFromSession";
import getNotes from "@/lib/api/getNotes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = await getEmailFromSession(req, res);

    if (req.method === "GET") {
      const page = parseInt(req.query.page as string) || 1;
      const query = req.query.query as string | null;

      const getAllResponse = await getNotes(email, page, query);
      res.status(200).json(getAllResponse);
    } else if (req.method === "POST") {
      const { title, content } = req.body;

      const createResponse = await createNote(email, title, content);
      res.status(200).json(createResponse);
    } else {
      throw new ServerError(404, "Not Found");
    }
  } catch (e) {
    errorHandler(e, res);
  }
}
