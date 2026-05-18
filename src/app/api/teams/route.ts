import connectDB from "@/app/lib/db/db";
import {getTeams } from "@/app/lib/service/team.service";


export const GET = async (req: Request) => {
    try {
        await connectDB();
        const teams = await getTeams();
        return Response.json(teams);
    } catch (error:any) {
        return Response.json({ error: error.message }, { status: 500 });
        
    }
};
