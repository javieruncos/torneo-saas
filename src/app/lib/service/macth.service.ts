import mongoose from "mongoose";
import Match from "../models/match.models";
import { match } from "assert";

type data = {
  homeTeam: string;
  awayTeam: string;
  date?: Date;
  time?: string;
  fieldNumber?: number;
  status?:"pending"|"finished";
  goals?: any[];
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
    const match = await Match.findById(id);

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
    

    await match.save();

    return match;
  } catch (error) {
    throw new Error("Error al actualizar el partido");
  }
};


const calculateScore = (match: any) => {
  let homeScore = 0;
  let awayScore = 0;

  match.goals.forEach((goal: any | []) => {
    if (goal.team === match.homeTeam) {
      homeScore++;
    } else if (goal.team === match.awayTeam) {
      awayScore++;
    }
  });

  return {
    home: homeScore,
    away: awayScore
  };
}


export const finishMatch = async (id: string , data: data) => {
  const match = await Match.findById(id);

  if (!match) {
    throw new Error("Partido no encontrado");
  }

  if (match.status === "finished") {
    throw new Error("El partido ya ha finalizado");
  }

  if (match.homeTeam === match.awayTeam) {
    throw new Error("Los equipos deben ser diferentes");
  }

  match.status = "finished";
  match.goals = data.goals || [];

  const score = calculateScore(match);
  match.score = score;

  await match.save();
  return match;

}

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

export const getTable = async () => {
  const matches = await Match.find({ status: "finished" })
    .populate("homeTeam awayTeam", "name");

  const table: any = {};

  for (const match of matches) {
    const homeId = match.homeTeam._id.toString();
    const awayId = match.awayTeam._id.toString();

    if (!table[homeId]) {
      table[homeId] = {
        team: match.homeTeam.name,
        points: 0,
        played: 0,
        won: 0,
        draw: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }

    if (!table[awayId]) {
      table[awayId] = {
        team: match.awayTeam.name,
        points: 0,
        played: 0,
        won: 0,
        draw: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      };
    }

    const home = table[homeId];
    const away = table[awayId];

    const homeGoals = match.score.home;
    const awayGoals = match.score.away;

    home.played++;
    away.played++;

    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;

    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (homeGoals < awayGoals) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.draw++;
      away.draw++;
      home.points += 1;
      away.points += 1;
    }
  }

  const result = Object.values(table);

  result.sort((a: any, b: any) => {
    if (b.points !== a.points) return b.points - a.points;

    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;

    return diffB - diffA;
  });

  return result;
};

export const getTeamStats = async (teamId: string) => {
  const matches = await Match.find({
    status: "finished",
    $or: [{ homeTeam: teamId }, { awayTeam: teamId }],
  });

  const stats = {
    played: 0,
    won: 0,
    draw: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  };

  for (const match of matches) {
    const isHome = match.homeTeam.toString() === teamId;

    const teamGoals = isHome ? match.score.home : match.score.away;
    const rivalGoals = isHome ? match.score.away : match.score.home;

    stats.played++;

    stats.goalsFor += teamGoals;
    stats.goalsAgainst += rivalGoals;

    if (teamGoals > rivalGoals) {
      stats.won++;
      stats.points += 3;
    } else if (teamGoals < rivalGoals) {
      stats.lost++;
    } else {
      stats.draw++;
      stats.points += 1;
    }
  }

  return stats;
};