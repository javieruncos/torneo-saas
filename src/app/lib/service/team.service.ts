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
    return teams;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los equipos");
  }
};

export const updateClub = async (id: string, data: any, file?: File) => {
  try {
    //obtener el equipo
    const club = await Clubes.findById(id);

    //si no existe el equipo lanzar un error
    if (!club) {
      throw new Error("El equipo no existe");
    }

    //actualizar el equipo con los nuevos datos
    let logo = club.logo;

    //si se pasa un nuevo archivo, eliminar el anterior y subir el nuevo
    if (file) {
      //eliminar la imagen anterior
      await cloudinary.uploader.destroy(club.logo.public_id);

      //convertir la imagen a buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      //subir la nueva imagen
      const upload = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "clubes" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        );

        stream.end(buffer);
      });

      //actualizar el equipo con la nueva imagen
      logo = {
        url: upload.secure_url,
        public_id: upload.public_id,
      };

      //actualizar el equipo con los nuevos datos
      const update = await Clubes.findByIdAndUpdate(
        id,
        {
          ...data,
          logo,
        },
        { new: true },
      );

      return update;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al actualizar el equipo");
  }
};

export const deleteClub = async (id: string) => {
  const club = await Clubes.findByIdAndDelete(id);

  if (!club) {
    throw new Error("El equipo no existe");
  }

  await cloudinary.uploader.destroy(club.logo.public_id);

  await Clubes.findByIdAndDelete(id);

  return { message: "Equipo eliminado correctamente" };
};
