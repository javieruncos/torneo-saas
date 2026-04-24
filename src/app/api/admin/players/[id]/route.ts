import connectDB from "@/app/lib/db/db";
import { deletePlayer } from "@/app/lib/service/players.service";

export const DELETE = async (req: Request, context: { params: { id: string } }) => {
  await connectDB();
  const {id} = await context.params;
  try {
    const deleted = await deletePlayer(id);
    return Response.json({message: "Jugador eliminado", deleted} , {status: 200});
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}