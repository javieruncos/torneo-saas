import connectDB from "@/app/lib/db/db";
import { createAdmin } from "@/app/lib/service/auth.service";


export const POST = async (req: Request) => {
    await connectDB();

    const data = await req.json();

    try {

        if ( !data.email || !data.password) {
            return new Response("Faltan datos", { status: 400 });
        }
        const admin = await createAdmin(data.email, data.password);

        return  Response.json( admin, { status: 201 });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
};