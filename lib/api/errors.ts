import { NextApiResponse } from "next";

export class ServerError extends Error {
  statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message);
    this.name = "ServerError";
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: any, res: NextApiResponse) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).send(message);
};
