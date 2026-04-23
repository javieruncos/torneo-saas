import { metadata } from './../../layout';
import mongoose, { models ,Schema} from "mongoose";


const MatchSchema = new Schema(
  {
    homeTeam: {
      type: Schema.Types.ObjectId,
      ref: "Clubes",
      required: true,
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      ref: "Clubes",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true, // ej: "20:30"
    },

    fieldNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "finished"],
      default: "pending",
    },

    goals: [
      {
        player: { type: Schema.Types.ObjectId, ref: "Player" },
        team: { type: Schema.Types.ObjectId, ref: "Clubes" },
      },
    ],

    assists: [
      {
        player: { type: Schema.Types.ObjectId, ref: "Player" },
      },
    ],

    yellowCards: [
      {
        player: { type: Schema.Types.ObjectId, ref: "Player" },
      },
    ],

    redCards: [
      {
        player: { type: Schema.Types.ObjectId, ref: "Player" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Match =
  models.Match || mongoose.model("Match", MatchSchema);

export default Match;