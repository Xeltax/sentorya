import { cookies } from "next/headers";
import Client, { setBearerToken } from "@/utils/client";
import { ROUTES } from "@/utils/routes";
import { User } from "@/types/User";
import UsersDataTable from "@/components/Datatable/UsersDataTable";

export default async function UsersPage() {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("JWT");
    setBearerToken(jwtCookie?.value || "");

    const data = await Client.get(ROUTES.BACK.USER.CRUD).then(
        (res) => res.data
    );

    console.log("Fetched users data:", data);
    const users: User[] = await data;

    return (
        <div className="container mx-auto py-10">
            {/* Composant client qui reçoit les données SSR */}
            <UsersDataTable initialUsers={users} />
        </div>
    );
}