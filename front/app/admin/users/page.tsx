import { columns } from "./columns"
import { DataTable } from "./data-table"
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {cookies} from "next/headers";

export default async function Page() {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("JWT");
    setBearerToken(jwtCookie?.value || "");
    const data = await Client.get(ROUTES.BACK.USER.CRUD).then(
        (res) => res.data
    )
    console.log("Fetched users data:", data)
    const users = await data

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={users} />
        </div>
    )
}