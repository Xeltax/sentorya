"use client";

import { useState } from "react";
import { Campaign } from "@/types/Campaign";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { DataTableWithSearch } from "@/components/Datatable/DatatableWithSearch";
import { useForm } from "react-hook-form";
import { columns } from "@/app/admin/campains/columns";
import {ROUTES} from "@/utils/routes";
import {toast} from "sonner";
import Client from "@/utils/client";
import {User} from "@/types/User";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface CampaignsDataTableProps {
    initialCampaigns: Campaign[];
    allOrganizations: Organizations[];
}

type CampaignFormData = {
    name: string;
    campaignId: string;
    organizationId: string;
};

const CampaignsDataTable = ({ initialCampaigns, allOrganizations }: CampaignsDataTableProps) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
    const [openDialog, setOpenDialog] = useState(false);

    const form = useForm<CampaignFormData>({
        defaultValues: {
            name: "",
            campaignId: "",
            organizationId: "",
        },
    });

    const handleCampaignUpdate = (updatedCampaign: Campaign) => {
        setCampaigns(prev =>
            prev.map(c => (c.id === updatedCampaign.id ? updatedCampaign : c))
        );
    };

    const handleCampaignDelete = (campaignId: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    };

    const onSubmit = async (data: CampaignFormData) => {
        console.log("Submitting campaign data:", data);
        try {
            const response = await Client.post(ROUTES.BACK.CAMPAIGN.CRUD, data);
            setCampaigns(prev => [...prev, response.data]);
            setOpenDialog(false);
            form.reset();
            toast.success("Campagne créée avec succès !");
        // @ts-expect-error("error is of type unknown")
        } catch (error : never) {
            console.error(error);
            toast.error(error.response?.data?.error || "Une erreur est survenue lors de la création de la campagne.");
        }
    };

    const tableColumns = columns(handleCampaignUpdate, handleCampaignDelete);

    console.log(campaigns)

    return (
        <>
            <Card className="mb-6 p-6">
                <h1 className="text-2xl font-bold">Liste des campagnes</h1>
                <p>
                    Gérez vos campagnes ici. Vous pouvez en créer une, la modifier, la supprimer et attribuer des utilisateurs.
                </p>
                <Button className="w-fit" onClick={() => setOpenDialog(true)}>
                    Ajouter une campagne
                </Button>
            </Card>

            <DataTableWithSearch columns={tableColumns} data={campaigns} />

            {openDialog && (
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une campagne</DialogTitle>
                            <DialogDescription asChild>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nom de la campagne" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="campaignId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ID de campagne</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Identifiant unique" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="organizationId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Entreprise associés</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Sélectionner une entreprises" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {allOrganizations.map((org) => (
                                                                    <SelectItem key={org.id} value={org.id}>
                                                                        {org.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit">Créer la campagne</Button>
                                    </form>
                                </Form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default CampaignsDataTable;
