import connectDB from "@/app/lib/db/db";
import { createTeam, getTeams } from "@/app/lib/services/team.service";
import { fileURLToPath } from "node:url";

export const POST = async (req: Request) => {
  await connectDB();
  const formData = await req.formData();

  console.log({
    name: formData.get("name"),
    category: formData.get("category"),
    shortname: formData.get("shortname"),
  });

  //extrar los datos del form
  const data = {
    name: formData.get("name") as string,
    shortname: formData.get("shortname") as string,
    city: formData.get("city") as string,
      category: formData.get("category") as string, // 🔥 ESTE FALTABA
    active: formData.get("active") === "on" ? true : false,
    description: formData.get("description") as string,
   colors: formData.get("colors")
  };

  const file = formData.get("file") as File;

  if (!data.name || !data.shortname || !data.city) {
    return new Response("Faltan datos", { status: 400 });
  }

  try {
    const club = await createTeam(data, file);
    return Response.json(club);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
    try {
        await connectDB();
        const teams = await getTeams();
        return Response.json(teams);
    } catch (error:any) {
        return Response.json({ error: error.message }, { status: 500 });
        
    }
};
