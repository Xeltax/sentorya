// Types GoPhish
export interface GoPhishTarget {
    email: string;
    firstName: string;
    lastName: string;
    position: string;
}

export interface GoPhishGroup {
    id?: number;
    name: string;
    targets: GoPhishTarget[];
    modifiedDate?: string;
}

export interface GoPhishTemplate {
    id?: number;
    name: string;
    subject?: string;
    text?: string;
    html?: string;
    modifiedDate?: string;
}

export interface GoPhishPage {
    id?: number;
    name: string;
    html: string;
    captureCredentials: boolean;
    capturePasswords: boolean;
    redirectUrl: string;
    modifiedDate?: string;
}

export interface GoPhishSMTP {
    id?: number;
    name: string;
    host?: string;
    interfaceType?: string;
    fromAddress?: string;
    ignoreCertErrors?: boolean;
    modifiedDate?: string;
}

export interface GoPhishCampaignStats {
    total: number;
    sent: number;
    opened: number;
    clicked: number;
    submittedData: number;
    emailReported: number;
    error: number;
}

export interface GoPhishResult {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    position: string;
    status: string;
    ip: string;
    latitude: number;
    longitude: number;
    sendDate: string;
    reported: boolean;
}

export interface GoPhishCampaignSummary {
    id: number;
    name: string;
    createdDate: string;
    launchDate: string;
    completedDate?: string;
    status: string;
    stats: GoPhishCampaignStats;
}

export interface GoPhishCampaign {
    id?: number;
    name: string;
    createdDate?: string;
    launchDate?: string;
    sendByDate?: string;
    completedDate?: string;
    template: { name: string };
    page: { name: string };
    status?: string;
    results?: GoPhishResult[];
    timeline?: any[];
    smtp: { name: string };
    url: string;
    groups: Array<{ name: string }>;
}