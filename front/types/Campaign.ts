import {User} from "@/types/User";

export type Campaign = {
    id: string,
    name : string,
    campaignId : string,
    organizationId : string,
    organizationName?: string,

    goPhishCampaignId?: number;
    goPhishGroupId?: number;
    templateName?: string;
    pageName?: string;
    smtpProfileName?: string;
    phishingUrl?: string;
}

export interface CreateCampaignRequest {
    name: string;
    campaignId: string;
    organizationId: string;


    createInGoPhish: boolean;
    templateName?: string;
    pageName?: string;
    smtpProfileName?: string;
    phishingUrl?: string;
    launchDate?: string;
}