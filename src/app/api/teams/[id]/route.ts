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

export const PUT = async (
  req: Request,
   context: { params: Promise<{ id: string }> }
) => {
  await connectDB();
  const formData = await req.formData();

  const { id } = await context.params;

  const data = {
    name: formData.get("name") as string,
    shortname: formData.get("shortname") as string,
    city: formData.get("city") as string,
    category: formData.get("category") as string,
    active: formData.get("active") === "on" ? true : false,
    description: formData.get("description") as string,
    colors: formData.get("colors"),
  };

  const file = formData.get("file") as File;

  try {
    const update = await updateClub(id, data, file);
    return Response.json(update);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const deleted = await deleteClub(params.id);
    return Response.json(deleted);
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}