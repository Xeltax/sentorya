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

    const data = await Client.get(ROUTES.BACK.ORGANIZATION.CRUD).then(
        (res) => res.data
    );

    const organizations: Organizations[] = await data;

    const data2 = await Client.get(ROUTES.BACK.CAMPAIGN.CRUD).then(
        (res) => res.data
    );

    data2.map((campaign: Campaign) => {
        const org = organizations.find(org => org.id === campaign.organizationId);
        if (org) {
            campaign.organizationName = org.name;
        }
    })

    console.log(data2);

    const campains: Campaign[] = await data2;

    return (
        <div className="container mx-auto py-10">
            {/* Composant client qui reçoit les données SSR */}
            <CampaignsDataTable allOrganizations={organizations} initialCampaigns={campains} />
        </div>
    );
}