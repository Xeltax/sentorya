import {cookies} from "next/headers";
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {User} from "@/types/User";
import OrganizationDatatable from "@/app/admin/organizations/OrganizationDatatable";

export default async function OrganizationsPage() {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("JWT");
    setBearerToken(jwtCookie?.value || "");

    const data = await Client.get(ROUTES.BACK.ORGANIZATION.CRUD).then(
        (res) => res.data
    );

    const dataUsers = await Client.get(ROUTES.BACK.USER.CRUD).then(
        (res) => res.data
    );

    const organizations: OrganizationsWithMembers[] = await data;

    await Promise.all(organizations.map(async (organization) => {
        await Client.get(ROUTES.BACK.ORGANIZATION.GET_MEMBERS(organization.id)).then(
            (res) => {
                organization.member = res.data.map((member: User) => {
                    return member.email;
                })
            }
        );
    }))

    const users: User[] = await dataUsers;

    return (
        <div className="container mx-auto py-10">
            <OrganizationDatatable initialOrganizations={organizations} />
        </div>
    );
}