"use client";

import { useState } from "react";
import {organizationColumns} from "@/app/admin/organizations/organizationColumns";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {DataTableWithSearch} from "@/components/Datatable/DatatableWithSearch";
import CreateOrganizationDialog from "@/components/Popup/CreateOrganizationDialog/createOrganizationDialog";
import {User} from "@/types/User";
import {OrganizationsWithMembers} from "@/types/OrganizationsWithMembers";
import {OrganizationProvider, useOrganizations} from "@/components/context/OrganizationContext";

interface OrganizationsDataTableProps {
    initialOrganizations: OrganizationsWithMembers[];
    users: User[];
}

const OrganizationDatatable = ({ initialOrganizations, users }: OrganizationsDataTableProps) => {
    return (
        <OrganizationProvider initialOrganizations={initialOrganizations}>
            <OrganizationDatatableContent users={users} />
        </OrganizationProvider>
    );
};

const OrganizationDatatableContent = ({ users }: { users: User[] }) => {
    const { organizations, addOrganization } = useOrganizations();
    const [openDialog, setOpenDialog] = useState(false);

    const tableColumns = organizationColumns(users);

    return (
        <>
            <Card className="mb-6 p-6">
                <h1 className="text-2xl font-bold">Liste des entreprises</h1>
                <p>Vous pouvez gérer les entreprises ici...</p>
                <Button className="w-fit" onClick={() => setOpenDialog(true)}>
                    Ajouter une entreprise
                </Button>
            </Card>

            <DataTableWithSearch columns={tableColumns} data={organizations} />

            {openDialog && (
                <CreateOrganizationDialog
                    isOpen={openDialog}
                    toggle={() => setOpenDialog(!openDialog)}
                    users={users}
                    createOrganization={addOrganization}
                />
            )}
        </>
    );
};

export default OrganizationDatatable;