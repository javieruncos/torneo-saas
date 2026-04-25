import connectDB from "@/app/lib/db/db";
import { createPlayer } from "@/app/lib/service/players.service";

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