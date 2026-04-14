import mongoose from "mongoose";


 const playerSchema = new mongoose.Schema({
     nombre:{
          type: String,
          required: true,
          trim: true
     },
     numero:{
          type: Number,
          required: true,
          trim: true
     },
     posicion: {
          type: String,
          required: true,
          trim: true
     },
     club: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"Clubes",
          required: true,
          trim: true
     },
      stats: {
      goals: {
        type: Number,
        default: 0,
      },
      assists: {
        type: Number,
        default: 0,
      },
      yellowCards: {
        type: Number,
        default: 0,
      },
      redCards: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);


export default mongoose.model("Players", playerSchema);