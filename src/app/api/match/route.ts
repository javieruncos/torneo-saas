import connectDB from "@/app/lib/db/db";
import Match from "@/app/lib/models/match.models";
import { createMatch, getMatches } from "@/app/lib/service/macth.service";
import mongoose from "mongoose";



export const GET = async (req: Request) => {
  await connectDB();
  try {
    const matches = await getMatches()
    return Response.json(matches, { status: 200 }); ;
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};




