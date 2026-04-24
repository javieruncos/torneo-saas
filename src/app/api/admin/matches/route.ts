import connectDB from "@/app/lib/db/db";
import { createMatch } from "@/app/lib/service/macth.service";

export const POST = async (req: Request) => {
  await connectDB();

  const data = await req.json();

  if (
    !data.homeTeam ||
    !data.awayTeam ||
    !data.date ||
    !data.time ||
    !data.fieldNumber
  ) {
    return Response.json({ error: "Faltan datos" }, { status: 400 });
  }

  try {
    const match = await createMatch(data);
    return Response.json(match, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Error al crear el partido" },
      { status: 400 },
    );
  }
};