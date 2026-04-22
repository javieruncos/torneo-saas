import connectDB from "@/app/lib/db/db";
import Match from "@/app/lib/models/match.models";
import { getMatchById, updateMatch } from "@/app/lib/service/macth.service";
import mongoose from "mongoose";

export const PATCH = async (req: Request,context: { params: Promise<{ id: string }> }) => {
  await connectDB();
  const {id} = await context.params;
  const data = await req.json();

  try {
  
    const match = await updateMatch(id, data);

    if (!match) {
      return Response.json({ error: "Partido no encontrado" }, { status: 404 });
    }

    return Response.json(match, { status: 200 }) ;

  } catch (error: any) {
    if (error.message === "ID inválido") {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error.message === "Partido no encontrado") {
      return Response.json({ error: error.message }, { status: 404 });
    }

    if (error.message === "No se puede modificar un partido finalizado") {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
};


export const DELETE = async (req: Request,context: { params: Promise<{ id: string }> }) => {
  await connectDB();
  const {id} = await context.params;
  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ error: "ID inválido" }, { status: 400 });
    }

    const deleted = await Match.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: "Partido no encontrado" }, { status: 404 });
    }
    return Response.json(deleted, { status: 200 }) ;
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

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