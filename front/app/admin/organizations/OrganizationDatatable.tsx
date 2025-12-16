"use client";

import { useState } from "react";
import {organizationColumns} from "@/app/admin/organizations/organizationColumns";
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

    const tableColumns = organizationColumns(users);

    console.log("Rendering OrganizationDatatable with organizations:", organizations);

    return (
        <>
            <Card className="mb-6 p-6">
                <h1 className="text-2xl font-bold">Liste des entreprises</h1>
                <p>
                    Vous pouvez gérer les entreprises ici. Cliquez sur les actions pour modifier ou supprimer une entreprise ou bien ajouter en un.
                </p>
                <Button className="w-fit" onClick={() => setOpenDialog(true)}>
                    Ajouter une entreprise
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