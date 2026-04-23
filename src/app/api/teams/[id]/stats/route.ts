import connectDB from "@/app/lib/db/db";
import { getTeamStats } from "@/app/lib/service/macth.service";


export const GET = async (
  req: Request,
  context: { params: Promise<{ id: string }> }
) => {
  await connectDB();

  const { id } = await context.params;

  try {
    const stats = await getTeamStats(id);

    return Response.json(stats, { status: 200 });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
};