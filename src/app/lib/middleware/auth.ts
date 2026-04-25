import Jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  role: string;
};

export const verifyToken = (req: any): TokenPayload => {
  
  const token = req.cookies.get("token")?.value;

  if (!token) {
    throw new Error("No autorizado");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET no definido");
  }

  try {
    const decoded = Jwt.verify(token, secret) as TokenPayload;

    return decoded;
  } catch {
    throw new Error("Token inválido");
  }
  
};
