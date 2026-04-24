import connectDB from "@/app/lib/db/db";
import { getMatchById } from "@/app/lib/service/macth.service";
import mongoose from "mongoose";



export const GET = async (req: Request,context: { params: Promise<{ id: string }> }) => {
  await connectDB();
  const {id} = await context.params;
  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

    const match = await getMatchById(id);
    if (!match) {
      return Response.json({ error: "Partido no encontrado" }, { status: 404 });
    }
    return Response.json(match) , { status: 200 }
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};