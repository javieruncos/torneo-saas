import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  role: string;
};

export function proxy(req: any) {
  const { pathname } = req.nextUrl;

  // 🔥 excluir rutas auth manualmente
  if (!pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
     throw new Error("JWT_SECRET no definido");
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

     if(pathname.startsWith("/api/admin")) {
        if (decoded.role !== "admin") {
          return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }
     }

    return NextResponse.next(); // ✅ deja pasar
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"], // ✅ simple
};
