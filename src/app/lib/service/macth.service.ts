import mongoose from "mongoose";
import Match from "../models/match.models";

type data = {
  homeTeam: string;
  awayTeam: string;
  date?: Date;
  time?: string;
  fieldNumber?: number;
  status?:"pending"|"finished";
};

export const createMatch = async (data: data) => {
  const { homeTeam, awayTeam, date, time, fieldNumber } = data;

  if (!homeTeam || !awayTeam || !date || !time || fieldNumber === undefined) {
    throw new Error("Faltan datos");
  }

  if(homeTeam === awayTeam) {
    throw new Error("Los equipos deben ser diferentes");
  }

  try {
    const match = await Match.create({
      homeTeam,
      awayTeam,
      date,
      time,
      fieldNumber,
      status: "pending",
    });

    return match;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const getMatches = async () => {
  try {
    const matchs = await Match.find().populate(
      "homeTeam awayTeam",
      "name shortname logo",
    );

    if (!matchs) {
      throw new Error("Partidos no encontrados");
    }

    return matchs;
  } catch (error) {
    throw new Error("Error al obtener los partidos");
  }
};

export const getMatchById = async (id: string) => {
  try {
    const matchs = await Match.findById(id);
    if (!matchs) {
      throw new Error("Partido no encontrado");
    }
    return matchs;
  } catch (error) {
    throw new Error("Error al obtener el partido");
  }
};

export const updateMatch = async (id: string, data: data) => {
 
  if(!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("ID inválido");
  }

  try {
    const match = await Match.findByIdAndUpdate(id, data, { new: true });

    if (!match) {
      throw new Error("Partido no encontrado");
    }

    if (match.status === "finished") {
      throw new Error("El partido ya ha finalizado");
    }

    if (match.homeTeam === match.awayTeam) {
      throw new Error("Los equipos deben ser diferentes");
    }

    if (data.date !== undefined) match.date = data.date;
    if (data.time !== undefined) match.time = data.time;
    if (data.fieldNumber !== undefined) match.fieldNumber = data.fieldNumber;
    if (data.status) match.status = data.status;

    await match.save();

    return match;
  } catch (error) {
    throw new Error("Error al actualizar el partido");
  }
};


export const deleteMatch = async (id: string) => {
  try {
    const match = await Match.findByIdAndDelete(id);
    if (!match) {
      throw new Error("Partido no encontrado");
    }
    return match;
  } catch (error) {
    throw new Error("Error al eliminar el partido");
  }
};