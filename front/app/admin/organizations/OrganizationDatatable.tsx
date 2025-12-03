"use client";

import { useState } from "react";
import {columns} from "@/app/admin/organizations/columns";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {DataTableWithSearch} from "@/components/Datatable/DatatableWithSearch";

interface OrganizationsDataTableProps {
    initialOrganizations: Organizations[];
}

const UsersDataTable = ({ initialOrganizations }: OrganizationsDataTableProps) => {
    const [organizations, setOrganizations] = useState<Organizations[]>(initialOrganizations);

    const tableColumns = columns()

    return (
        <>
            <Card className="mb-6 p-6">
                <h1 className="text-2xl font-bold">Liste des organizations</h1>
                <p>
                    Vous pouvez gérer les orgnizations ici. Cliquez sur les actions pour modifier ou supprimer une organizations ou bien ajouter en un.
                </p>
                <Button className="w-fit" >
                    Ajouter une organization
                </Button>
            </Card>

            <DataTableWithSearch columns={tableColumns} data={organizations}/>
        </>
    );
};

export default UsersDataTable;