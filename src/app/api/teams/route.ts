import connectDB from "@/app/lib/db/db";
import { createTeam, getTeams } from "@/app/lib/services/team.service";

export const POST = async (req: Request) => {
    await connectDB();
    const formData = await req.formData();
    
    const name = formData.get("name");
    const file = formData.get("file");
    

    const data = await req.json();
    const team = await createTeam(data);
    return Response.json(team);
};

export const GET = async (req: Request) => {
    await connectDB();
    const teams = await getTeams();
    return Response.json(teams);
};