import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    
    email: {
     type: String,
     required: true,
     unique: true,
     trim: true 
    },

    password: {
     type: String,
     required: true,
     trim: true
    },
    role:{
        type: String,
        default: "admin",
        trim: true
    }
})


export default mongoose.model("User", UserSchema);