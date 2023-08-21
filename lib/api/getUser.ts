import { ServerError } from "@/lib/api/errors";
import clientPromise from "@/lib/mongodb";

const getUser = async (email: string) => {
  const client = await clientPromise;
  const usersCollection = client.db(process.env.DB_NAME).collection("users");
  const user = await usersCollection.findOne({ email });

  if (!user) {
    throw new ServerError(400, "User not found");
  }

  return user;
};

export default getUser;
