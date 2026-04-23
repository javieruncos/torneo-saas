import bcrypt from "bcryptjs";
import User from "../models/user.models";


export const createAdmin = async (email: string, password: string) => {
      if (!email.trim() || !password.trim()) {
        throw new Error("Faltan datos");
      }
      
      try {
         const userCount = await User.countDocuments();
        
         if(userCount > 0) {
            throw new Error("Registro desactivado");
         }

         const hashedPassword = await bcrypt.hash(password, 10);
         const admin = await User.create({ email, password: hashedPassword, role: "admin" });
         return admin;


      } catch (error:any) {
        throw new Error(error.message);
      }
}