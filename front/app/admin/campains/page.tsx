import {cookies} from "next/headers";
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {User} from "@/types/User";
import CampaignsDataTable from "@/components/Datatable/CampaignsDatatable";
import {Campaign} from "@/types/Campaign";

export default async function UsersPage() {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("JWT");
    setBearerToken(jwtCookie?.value || "");

    const data = await Client.get(ROUTES.BACK.USER.CRUD).then(
        (res) => res.data
    );

    const users: User[] = await data;

    const data2 = await Client.get(ROUTES.BACK.CAMPAIGN.CRUD).then(
        (res) => res.data
    );

    const campains: Campaign[] = await data2;

    return (
        <div className="container mx-auto py-10">
            {/* Composant client qui reçoit les données SSR */}
            <CampaignsDataTable allUsers={users} initialCampaigns={campains} />
        </div>
    );
}