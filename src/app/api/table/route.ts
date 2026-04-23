import connectDB from "@/app/lib/db/db";
import { getTable } from "@/app/lib/service/macth.service";

export const GET = async () => {
  await connectDB();

  try {
    const table = await getTable();
    return Response.json(table);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};