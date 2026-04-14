import connectDB from "@/app/lib/db/db";
import { createPlayer, getPlayersByClub } from "@/app/lib/service/players.service";

export const POST = async (req: Request) => {
  await connectDB();
  const formData = await req.formData();

  const data = {
    nombre: formData.get("nombre") as string,
    numero: Number(formData.get("numero")),
    posicion: formData.get("posicion") as string,
    club: formData.get("club") as string,
  };

  if (!data.nombre || !data.club) {
    return Response.json({ error: "Faltan datos" }, { status: 400 });
  }

  try {
    const player = await createPlayer(data);
    return Response.json(player);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};



export const GET = async (req: Request) => {
    await connectDB();

    try {
        const {searchParams} = new URL(req.url);
        const clubId = searchParams.get("club");

        if(!clubId){
            return Response.json({ error: "Faltan datos" }, { status: 400 });
        }

        const players = await getPlayersByClub(clubId);
        return Response.json(players);
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}