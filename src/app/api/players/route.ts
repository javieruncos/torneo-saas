import connectDB from "@/app/lib/db/db";
import { createPlayer, getPlayersByClub } from "@/app/lib/service/players.service";

export const GET = async (req: Request) => {
    await connectDB();

    try {
        const {searchParams} = new URL(req.url);
        const clubId = searchParams.get("club");

        if(!clubId){
            return Response.json({ error: "Faltan datos" }, { status: 400 });
        }

        const players = await getPlayersByClub(clubId);
        return Response.json(players);
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}