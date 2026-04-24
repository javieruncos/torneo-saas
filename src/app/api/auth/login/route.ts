import connectDB from "@/app/lib/db/db";
import { login } from "@/app/lib/service/auth.service";
import { NextResponse } from "next/server";




export const POST = async (req: Request) => {
    await connectDB();
     try {
         const {email, password} = await req.json();

         if(!email || !password){
            return new Response("Faltan datos", { status: 400 });
         }

         const token = await login(email, password);

         const response = NextResponse.json({ok: true},{status: 200});

         response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 ,
         });

         return response;
        
     } catch (error: any) {
        return Response.json({error:error.message}, { status: 400 });
     }
}