import connectDB from "@/app/lib/db/db";
import { createMatch } from "@/app/lib/service/macth.service";
import { createMatchSchema } from "@/app/lib/validators/match.schema";

export const POST = async (req: Request) => {
  await connectDB();


  try {
    const body = await req.json();
    const result =  createMatchSchema.safeParse(body);


    if (!result.success) {
      return Response.json(
        { error: result.error.message },
        { status: 400 },
      );
    }

    const data = result.data;

    const match = await createMatch(data);
    return Response.json(match, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Error al crear el partido" },
      { status: 400 },
    );
  }
};