import { ParamsOf } from "./../../../../../.next/types/routes.d";
import connectDB from "@/app/lib/db/db";
import Clubes from "@/app/lib/models/teams.model";
import { deleteClub, updateClub } from "@/app/lib/service/team.service";


export const GET = async (
  req: Request,
 context: { params: Promise<{ id: string }> }
) => {
  await connectDB();

  const {id} = await context.params;
  try {
    const club = await Clubes.findById(id);
    if (!club) {
      return Response.json({ error: "Equipo no encontrado" }, { status: 404 });
    }

    return Response.json(club);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

