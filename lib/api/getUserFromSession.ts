import { NextApiRequest, NextApiResponse } from "next";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";

import { ServerError } from "@/lib/api/errors";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const getUserFromSession = async (
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"]
) => {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email?.toLowerCase();
  const name = session?.user?.name;

  if (!session || !email) {
    throw new ServerError(401, "Unauthorized");
  }

  return { email, name };
};

export default getUserFromSession;
