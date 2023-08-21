import { PAGE_SIZE } from "@/components/NotesList/ListContext";
import getUser from "@/lib/api/getUser";
import escapeRegex from "@/lib/escapeRegex";
import clientPromise from "@/lib/mongodb";
import Note from "@/types/Note";

const getNotes = async (
  email: string,
  page: number,
  query?: string | null
): Promise<{ data: Note[]; total: number }> => {
  const client = await clientPromise;
  const user = await getUser(email);
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
            { $skip: (page - 1) * PAGE_SIZE },
            { $limit: PAGE_SIZE },
          ],
          total: [{ $count: "count" }],
        },
      },
    ])
    .toArray();

  return { data: result[0].data, total: result[0].total[0]?.count || 0 };
};

export default getNotes;
