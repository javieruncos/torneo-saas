import { NextResponse } from "next/server";

export const POST = async () => {
  const response = NextResponse.json(
    { ok: true },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // 👈 clave
    path: "/",
  });

  return response;
};