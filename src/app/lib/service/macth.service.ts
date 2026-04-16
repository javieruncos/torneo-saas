import Match from "../models/match.models";

type data = {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  time: string;
  fieldNumber: number;
};

export const createMatch = async (data: data) => {
  const { homeTeam, awayTeam, date, time, fieldNumber } = data;

  if (!homeTeam || !awayTeam || !date || !time || !fieldNumber) {
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
    throw new Error(error.message), { status: 500 };
  }
};
