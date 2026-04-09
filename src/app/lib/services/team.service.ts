import { Team } from "@/app/types/team";
import Clubes from "@/app/lib/models/teams.model";

export const createTeam = async (data: Team) => {
    try {
        const response = await Clubes.create(data);
        return response;
    } catch (error) {
        console.log(error);
        return error;  
    }
};

export const getTeams = async () => {
    try {
        const res = await fetch("/api/teams");
        return res.json();
    } catch (error) {
        console.log(error);
    }
};