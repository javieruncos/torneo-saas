import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: "ID inválido" }
);

export const createMatchSchema = z.object({
  homeTeam: objectId,
  awayTeam: objectId,

  date: z.coerce.date(),

  time: z.string().min(1, "Hora requerida"),

  fieldNumber: z.coerce.number().min(1, "Número de cancha requerido"),

  status: z.enum(["pending", "finished"]).default("pending"),

  goals: z
    .array(
      z.object({
        player: objectId,
        team: objectId,
      })
    )
    .default([]),

  assists: z
    .array(
      z.object({
        player: objectId,
      })
    )
    .default([]),

  yellowCards: z
    .array(
      z.object({
        player: objectId,
      })
    )
    .default([]),

  redCards: z
    .array(
      z.object({
        player: objectId,
      })
    )
    .default([]),
}).refine(
  (data) => data.homeTeam !== data.awayTeam,
  {
    message: "Los equipos no pueden ser iguales",
    path: ["homeTeam"],
  }
);

export type CreateMatchInput = z.infer<typeof createMatchSchema>;