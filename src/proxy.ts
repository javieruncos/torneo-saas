import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: any) {
  const { pathname } = req.nextUrl;

  // 🔥 excluir rutas auth manualmente
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next(); // ✅ deja pasar
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"], // ✅ simple
};
