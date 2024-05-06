"use server";

import { currentUser } from "@clerk/nextjs";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not authenticated");
  if (!apiKey) throw new Error("Stream API key is missing");
  if (!apiSecret) throw new Error("Stream secret key is missing");

  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 3600;
  const issued = Math.floor(new Date().getTime() / 1000) - 60;

  const token = client.createToken(user.id, exp, issued);

  return token;
};
