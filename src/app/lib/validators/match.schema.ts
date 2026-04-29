import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: "ID inválido" }
);

const baseMatchSchema = z.object({
  homeTeam: objectId,
  awayTeam: objectId,

  date: z.coerce.date(),

  time: z.string().min(1, "Hora requerida"),

  fieldNumber: z.coerce.number().min(1, "Número de cancha requerido"),
});

export const createMatchSchema = baseMatchSchema.extend({
  status:z.enum(["pending","finished"]).default("pending")
}).refine((data)=>{data.homeTeam !== data.awayTeam},{message:"Los equipos deben ser diferentes" , path:["homeTeam"]});

export type CreateMatchInput = z.infer<typeof createMatchSchema>;


export const updateMatchSchema = baseMatchSchema.partial().extend({
  status:z.enum(["pending","fiished"]).optional(),
}).refine((data)=> !data.homeTeam || !data.awayTeam || data.homeTeam !== data.awayTeam , {message:"Los equipos deben ser diferentes" , path:["homeTeam"]});


export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;


export const addStatsSchema = z
  .object({
    goals: z
      .array(
        z.object({
          player: objectId,
          team: objectId,
        })
      )
      .optional(),

    assists: z
      .array(
        z.object({
          player: objectId,
        })
      )
      .optional(),

    yellowCards: z
      .array(
        z.object({
          player: objectId,
        })
      )
      .optional(),

    redCards: z
      .array(
        z.object({
          player: objectId,
        })
      )
      .optional(),
  })
  .refine(
  (data) =>
    (data.goals && data.goals.length > 0) ||
    (data.assists && data.assists.length > 0) ||
    (data.yellowCards && data.yellowCards.length > 0) ||
    (data.redCards && data.redCards.length > 0),
  {
    message: "Debes enviar al menos una estadística",
  }
);

export type AddStatsInput = z.infer<typeof addStatsSchema>;