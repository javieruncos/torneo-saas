import Players from "../models/players.model";
import Clubes from "../models/teams.model";
import mongoose from "mongoose";

type data = {
  nombre: string;
  numero: number;
  posicion: string;
  club: string;
};

export const createPlayer = async (data: data) => {
  const { nombre, numero, posicion, club } = data;

  if (!nombre || !numero || !posicion || !club) {
    throw new Error("Faltan datos");
  }

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