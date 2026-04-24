import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.models";

export const createAdmin = async (email: string, password: string) => {
  if (!email.trim() || !password.trim()) {
    throw new Error("Faltan datos");
  }

  try {
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      throw new Error("Registro desactivado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });
    return admin;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const login = async (email: string, password: string) => {
  if (!email.trim() || !password.trim()) {
    throw new Error("Faltan datos");
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    return token;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
