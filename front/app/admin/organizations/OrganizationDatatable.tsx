"use client";

import { useState } from "react";
import {columns} from "@/app/admin/organizations/columns";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {DataTableWithSearch} from "@/components/Datatable/DatatableWithSearch";
import CreateOrganizationDialog from "@/components/Popup/CreateOrganizationDialog/createOrganizationDialog";
import {User} from "@/types/User";
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";

interface OrganizationsDataTableProps {
    initialOrganizations: OrganizationsWithMembers[];
    users: User[];
}

const OrganizationDatatable = ({ initialOrganizations, users }: OrganizationsDataTableProps) => {
    const [organizations, setOrganizations] = useState<OrganizationsWithMembers[]>(initialOrganizations);
    const [openDialog, setOpenDialog] = useState(false);

    const tableColumns = columns(users);

    console.log("Rendering OrganizationDatatable with organizations:", organizations);

    return (
        <>
            <Card className="mb-6 p-6">
                <h1 className="text-2xl font-bold">Liste des organizations</h1>
                <p>
                    Vous pouvez gérer les orgnizations ici. Cliquez sur les actions pour modifier ou supprimer une organizations ou bien ajouter en un.
                </p>
                <Button className="w-fit" onClick={() => setOpenDialog(true)}>
                    Ajouter une organization
                </Button>
            </Card>

            <DataTableWithSearch columns={tableColumns} data={organizations} />

            {openDialog &&
                <CreateOrganizationDialog isOpen={openDialog} toggle={() => setOpenDialog(!openDialog)} users={users} createOrganization={(organization) => {
                    console.log("Adding organization:", organization);
                    setOrganizations([...organizations, organization]);
                }}/>
            }
        </>
    );
};

export default OrganizationDatatable;