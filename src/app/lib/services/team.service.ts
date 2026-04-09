import { Team } from "@/app/types/team";
import Clubes from "@/app/lib/models/teams.model";
import cloudinary from "../cloudinary";

export const createTeam = async (data: any, file: File) => {
    console.log("DATA EN SERVICE:", data);
  try {
    if (!file) {
      throw new Error("la imagen es requerida");
    }

    const { name, shortname, category, description, city, active, colors } =
      data;

    const exists = await Clubes.findOne({ name: data.name });

    if (exists) {
      throw new Error("El club ya existe");
    }

    let parsedColors = {};
    if (colors) {
      try {
        parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;
      } catch (error) {
        return Response.json({ error: "Invalid colors" }, { status: 400 });
      }
    }

    const baseSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    //convertir la imagen a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "clubes", public_id: uniqueSlug },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(buffer);
    });

    const club = await Clubes.create({
      ...data,
      colors: parsedColors,
      slug: uniqueSlug,
      logo: {
        url: upload.secure_url,
        public_id: upload.public_id,
      },
    });

    return club;

  } catch (error: any) {
    throw new Error(error.message || "Error al crear el equipo");
  }
};

export const getTeams = async () => {
  try {
    const teams = await Clubes.find();
    return teams
  } catch (error) {
    console.log(error);
       throw new Error("Error al obtener los equipos");
  }
};
