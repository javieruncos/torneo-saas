import zod from "zod";
import mongoose from "mongoose";

const objectId = zod.string().refine(
    (val) => mongoose.Types.ObjectId.isValid(val),
    { message: "ID inválido" }
);

const statsSchema = zod.object({
    goals: zod.number().min(0, "Goles requeridos"),
    assists: zod.number().min(0, "Asistencias requeridas"),
    yellowCards: zod.number().min(0, "Tarjetas amarillas requeridas"),
    redCards: zod.number().min(0, "Tarjetas rojas requeridas"),
})

const basePlayerSchema = zod.object({
    nombre: zod.string().min(1, "Nombre requerido"),
    numero: zod.coerce.number().min(1, "Número requerido"),
    posicion: zod.string().min(1, "Posición requerida"),
    club: objectId,
});


export const createPlayerSchema = basePlayerSchema.extend({
    stats:statsSchema.partial().optional(),
});

export type createPlayerInput = zod.infer<typeof createPlayerSchema>;

export const updatePlayerSchema = basePlayerSchema.partial().extend({
    stats:statsSchema.partial().optional(),
});

export type updatePlayerInput = zod.infer<typeof updatePlayerSchema>;