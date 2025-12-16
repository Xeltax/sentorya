"use client";

import { useState, useEffect } from "react";
import Client from "@/utils/client";
import { ROUTES } from "@/utils/routes";
import { toast } from "sonner";
import {
    GoPhishTemplate,
    GoPhishPage,
    GoPhishSMTP,
    GoPhishGroup,
    GoPhishCampaignSummary
} from "@/types/GoPhish";

export function useGoPhish() {
    const [templates, setTemplates] = useState<GoPhishTemplate[]>([]);
    const [pages, setPages] = useState<GoPhishPage[]>([]);
    const [smtpProfiles, setSMTPProfiles] = useState<GoPhishSMTP[]>([]);
    const [groups, setGroups] = useState<GoPhishGroup[]>([]);
    const [campaigns, setCampaigns] = useState<GoPhishCampaignSummary[]>([]);
    const [loading, setLoading] = useState(false);

    // Charger les templates
    const loadTemplates = async () => {
        try {
            setLoading(true);
            const response = await Client.get(ROUTES.BACK.GOPHISH.TEMPLATES);
            console.log("Templates chargés:", response.data);
            setTemplates(response.data);
        } catch (error: any) {
            console.error("Erreur chargement templates:", error);
            toast.error("Impossible de charger les templates GoPhish");
        } finally {
            setLoading(false);
        }
    };

    // Charger les pages
    const loadPages = async () => {
        try {
            setLoading(true);
            const response = await Client.get(ROUTES.BACK.GOPHISH.PAGES);
            setPages(response.data);
        } catch (error: any) {
            console.error("Erreur chargement pages:", error);
            toast.error("Impossible de charger les landing pages GoPhish");
        } finally {
            setLoading(false);
        }
    };

    // Charger les profils SMTP
    const loadSMTPProfiles = async () => {
        try {
            setLoading(true);
            const response = await Client.get(ROUTES.BACK.GOPHISH.SMTP);
            setSMTPProfiles(response.data);
        } catch (error: any) {
            console.error("Erreur chargement SMTP:", error);
            toast.error("Impossible de charger les profils SMTP GoPhish");
        } finally {
            setLoading(false);
        }
    };

    // Charger les groupes
    const loadGroups = async () => {
        try {
            setLoading(true);
            const response = await Client.get(ROUTES.BACK.GOPHISH.GROUPS);
            setGroups(response.data);
        } catch (error: any) {
            console.error("Erreur chargement groupes:", error);
            toast.error("Impossible de charger les groupes GoPhish");
        } finally {
            setLoading(false);
        }
    };

    // Charger les campagnes GoPhish
    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const response = await Client.get(ROUTES.BACK.GOPHISH.CAMPAIGNS);
            setCampaigns(response.data);
        } catch (error: any) {
            console.error("Erreur chargement campagnes:", error);
            toast.error("Impossible de charger les campagnes GoPhish");
        } finally {
            setLoading(false);
        }
    };

    // Créer un template
    const createTemplate = async (template: Omit<GoPhishTemplate, "id" | "modifiedDate">) => {
        try {
            const response = await Client.post(ROUTES.BACK.GOPHISH.TEMPLATES, template);
            toast.success("Template créé avec succès");
            await loadTemplates();
            return response.data;
        } catch (error: any) {
            console.error("Erreur création template:", error);
            toast.error(error.response?.data?.error || "Erreur lors de la création du template");
            throw error;
        }
    };

    // Créer une page
    const createPage = async (page: Omit<GoPhishPage, "id" | "modifiedDate">) => {
        try {
            const response = await Client.post(ROUTES.BACK.GOPHISH.PAGES, page);
            toast.success("Landing page créée avec succès");
            await loadPages();
            return response.data;
        } catch (error: any) {
            console.error("Erreur création page:", error);
            toast.error(error.response?.data?.error || "Erreur lors de la création de la page");
            throw error;
        }
    };

    // Récupérer le résumé d'une campagne
    const getCampaignSummary = async (campaignId: number) => {
        try {
            const response = await Client.get(ROUTES.BACK.GOPHISH.CAMPAIGN_SUMMARY(campaignId));
            return response.data;
        } catch (error: any) {
            console.error("Erreur récupération résumé:", error);
            toast.error("Impossible de récupérer les résultats de la campagne");
            throw error;
        }
    };

    // Marquer une campagne comme terminée
    const completeCampaign = async (campaignId: number) => {
        try {
            await Client.post(ROUTES.BACK.GOPHISH.COMPLETE_CAMPAIGN(campaignId));
            toast.success("Campagne marquée comme terminée");
            await loadCampaigns();
        } catch (error: any) {
            console.error("Erreur completion campagne:", error);
            toast.error("Impossible de terminer la campagne");
            throw error;
        }
    };

    return {
        // States
        templates,
        pages,
        smtpProfiles,
        groups,
        campaigns,
        loading,

        // Actions
        loadTemplates,
        loadPages,
        loadSMTPProfiles,
        loadGroups,
        loadCampaigns,
        createTemplate,
        createPage,
        getCampaignSummary,
        completeCampaign,
    };
}