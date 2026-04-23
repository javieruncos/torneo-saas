import connectDB from "@/app/lib/db/db";
import { finishMatch } from "@/app/lib/service/macth.service";
import { connect } from "http2"




export const PATCH = async (req: Request,context: { params: Promise<{ id: string }> })=>{
   await connectDB();

   const {id} = await context.params;
   const data = await req.json();

   try {
     const match = await finishMatch(id, data);
    return Response.json(match, { status: 200 });

   } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
   }
}

