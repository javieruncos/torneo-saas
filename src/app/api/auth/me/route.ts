import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: any) => {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    return NextResponse.json(
      { user: decoded },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { user: null },
      { status: 200 }
    );
  }
};