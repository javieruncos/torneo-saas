import connectDB from "@/app/lib/db/db";
import { getTopScorers } from "@/app/lib/service/players.service";


export const GET = async () => {
  await connectDB();

  try {
    const players = await getTopScorers();

    return Response.json(players, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
};