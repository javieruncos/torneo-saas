import connectDB from "@/app/lib/db/db";
import mongoose from "mongoose";
import Players from "@/app/lib/models/players.model";
import { deletePlayer } from "@/app/lib/service/players.service";

export const GET = async (
  req: Request,
  context: { params: Promise<{ id: string }> },
) => {
  await connectDB();
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ error: "ID inválido" }, { status: 400 });
  } 
  
  try {
    const player = await Players.findById(id);
    if (!player) {
      return Response.json({ error: "Jugador no encontrado" }, { status: 404 });
    }
    return Response.json(player);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};


