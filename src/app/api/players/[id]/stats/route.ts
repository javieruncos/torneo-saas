import connectDB from "@/app/lib/db/db";
import Players from "@/app/lib/models/players.model";
import mongoose from "mongoose";
 interface IPlayer {
  name: string;
  club: string;

  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  }

  save(): Promise<IPlayer>;
}


export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const { goals, assists, yellowCards, redCards } = body;

  try {
    // ✅ validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const player = (await Players.findById(id)) as IPlayer | null;

    if (!player) {
      return Response.json(
        { error: "Jugador no encontrado" },
        { status: 404 }
      );
    }


    if (!player.stats) {
      player.stats = {
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      };
    }

   
    if (goals !== undefined && typeof goals !== "number") {
      return Response.json(
        { error: "goals debe ser número" },
        { status: 400 }
      );
    }

    if (assists !== undefined && typeof assists !== "number") {
      return Response.json(
        { error: "assists debe ser número" },
        { status: 400 }
      );
    }

    if (yellowCards !== undefined && typeof yellowCards !== "number") {
      return Response.json(
        { error: "yellowCards debe ser número" },
        { status: 400 }
      );
    }

    if (redCards !== undefined && typeof redCards !== "number") {
      return Response.json(
        { error: "redCards debe ser número" },
        { status: 400 }
      );
    }

   
    if (goals !== undefined) player.stats.goals = goals;
    if (assists !== undefined) player.stats.assists = assists;
    if (yellowCards !== undefined) player.stats.yellowCards = yellowCards;
    if (redCards !== undefined) player.stats.redCards = redCards;

    await player.save();

    return Response.json(player);
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
