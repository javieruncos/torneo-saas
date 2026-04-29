import { updatePlayerInput } from "./../validators/player.schema";
import Players from "../models/players.model";
import Clubes from "../models/teams.model";
import mongoose from "mongoose";
import { createPlayerInput } from "../validators/player.schema";

export const createPlayer = async (data: createPlayerInput) => {
  const { nombre, numero, posicion, club } = data;

  const existsClub = await Clubes.findById(club);

  if (!existsClub) {
    throw new Error("El equipo no existe");
  }

  const existsPlayer = await Players.findOne({ numero, club });

  if (existsPlayer) {
    throw new Error("El jugador ya existe");
  }

  const player = await Players.create(data);
  return player;
};

export const getPlayersByClub = async (clubId: string) => {
  if (!clubId) {
    throw new Error("Faltan datos");
  }

  if (!mongoose.Types.ObjectId.isValid(clubId)) {
    throw new Error("ID inválido");
  }

  const players = await Players.find({ club: clubId });
  return players;
};

export const getPlayerById = async (id: string) => {
  const player = await Players.findById(id).populate("club", "name shortname");

  if (!player) {
    throw new Error("El jugador no existe");
  }

  return player;
};

export const getTopScorers = async () => {
  const players = await Players.find()
    .populate("club", "name shortname")
    .sort({ "stats.goals": -1 })
    .limit(10);

  return players;
};

export const deletePlayer = async (id: string) => {
  try {
    const player = await Players.findByIdAndDelete(id);

    if (!player) {
      throw new Error("El jugador no existe");
    }

    return player;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updatePlayer = async (id: string, data: updatePlayerInput) => {
  try {
    const player = await Players.findById(id);

    if (!player) {
      throw new Error("El jugador no existe");
    }

    const club = data.club ?? player.club;
    const numero = data.numero ?? player.numero;

    const exists = await Players.findOne({
      club,
      numero,
      _id: { $ne: id },
    });

    if (exists) {
      throw new Error("El número ya está ocupado en este club");
    }

    const updatedPlayer = await Players.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return updatedPlayer;
  } catch (error: any) {
    throw new Error("Error al actualizar el jugador");
  }
};
