"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTableWithSearch } from "@/components/Datatable/DatatableWithSearch";
import { campaignColumns } from "@/app/admin/campains/campaignColumns";
import CreateCampaignDialog from "@/components/Popup/CreateCampaignDialog/CreateCampaignDialog";
import { Campaign, CreateCampaignRequest } from "@/types/Campaign";
import Client from "@/utils/client";
import { ROUTES } from "@/utils/routes";
import { toast } from "sonner";

interface CampaignsDataTableProps {
    initialCampaigns: Campaign[];
    allOrganizations: Array<{ id: string; name: string }>;
}

export default function CampaignsDataTable({
                                               initialCampaigns,
                                               allOrganizations
                                           }: CampaignsDataTableProps) {
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateCampaign = async (formData: CreateCampaignRequest) => {
        try {
            setLoading(true);

            const response = await Client.post(ROUTES.BACK.CAMPAIGN.CRUD, formData);

            const newCampaign: Campaign = response.data;

            // Ajouter le nom de l'organisation
            const org = allOrganizations.find(o => o.id === newCampaign.organizationId);
            if (org) {
                newCampaign.organizationName = org.name;
            }

            setCampaigns(prev => [...prev, newCampaign]);

            if (formData.createInGoPhish) {
                toast.success("Campagne créée et lancée dans GoPhish !");
            } else {
                toast.success("Campagne créée avec succès");
            }

            setOpenDialog(false);
        } catch (error: any) {
            console.error("Erreur création campagne:", error);
            toast.error(error.response?.data?.error || "Erreur lors de la création de la campagne");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCampaign = async (campaignId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette campagne ?")) {
            return;
        }

        try {
            await Client.delete(`${ROUTES.BACK.CAMPAIGN.CRUD}/${campaignId}`);
            setCampaigns(prev => prev.filter(c => c.id !== campaignId));
            toast.success("Campagne supprimée avec succès");
        } catch (error: any) {
            console.error("Erreur suppression campagne:", error);
            toast.error("Erreur lors de la suppression de la campagne");
        }
    };

    const tableColumns = campaignColumns(
        (campaign: Campaign) => {
            // Logique de mise à jour si nécessaire
        },
        handleDeleteCampaign
    );

    return (
        <>
            <Card className="mb-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Campagnes de Phishing</h1>
                        <p className="text-muted-foreground">
                            Gérez vos campagnes de sensibilisation et suivez les résultats
                        </p>
                    </div>
                    <Button onClick={() => setOpenDialog(true)}>
                        Créer une campagne
                    </Button>
                </div>
            </Card>

            <DataTableWithSearch columns={tableColumns} data={campaigns} />

            {openDialog && (
                <CreateCampaignDialog
                    isOpen={openDialog}
                    toggle={() => setOpenDialog(false)}
                    organizations={allOrganizations}
                    onCampaignCreated={handleCreateCampaign}
                />
            )}
        </>
    );
}