import { GoPhishCampaignSummary, GoPhishResult } from "@/types/GoPhish";

export interface DashboardCampaign {
    id: string;
    name: string;
    reference: string;
    date: string;
    goPhishId: number;
    status: string;
    stats: {
        opened: number;
        clicked: number;
        submitted: number;
    };
    previousStats?: {
        opened: number;
        clicked: number;
        submitted: number;
    };
    targets: DashboardTarget[];
}

export interface DashboardTarget {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    opened: boolean;
    clicked: boolean;
    submitted: boolean;
    reported: boolean;
    score: number;
    status: string;
}

function parseGoPhishStatus(status: string): {
    opened: boolean;
    clicked: boolean;
    submitted: boolean;
} {
    const statusLower = status.toLowerCase();

    return {
        opened: statusLower.includes("opened") ||
            statusLower.includes("clicked") ||
            statusLower.includes("submitted"),
        clicked: statusLower.includes("clicked") ||
            statusLower.includes("submitted"),
        submitted: statusLower.includes("submitted")
    };
}

function calculateUserScore(target: DashboardTarget): number {
    let score = 0;

    if (target.opened) score += 30;
    if (target.clicked) score += 40;
    if (target.submitted) score += 30;

    return score;
}

// Transformer un result GoPhish en target dashboard
export function transformGoPhishResult(result: GoPhishResult): DashboardTarget {
    const actions = parseGoPhishStatus(result.status);

    const target: DashboardTarget = {
        id: result.id,
        firstName: result.firstName || "",
        lastName: result.lastName || "",
        email: result.email,
        opened: actions.opened,
        clicked: actions.clicked,
        submitted: actions.submitted,
        reported: result.reported,
        status: result.status,
        score: 0, // Sera calculé après
    };

    target.score = calculateUserScore(target);

    return target;
}

// Calculer les stats en pourcentage à partir des targets
export function calculateStatsFromTargets(targets: DashboardTarget[]): {
    opened: number;
    clicked: number;
    submitted: number;
} {
    if (targets.length === 0) {
        return { opened: 0, clicked: 0, submitted: 0 };
    }

    const total = targets.length;
    const openedCount = targets.filter(t => t.opened).length;
    const clickedCount = targets.filter(t => t.clicked).length;
    const submittedCount = targets.filter(t => t.submitted).length;

    return {
        opened: Math.round((openedCount / total) * 100),
        clicked: Math.round((clickedCount / total) * 100),
        submitted: Math.round((submittedCount / total) * 100),
    };
}

// Transformer une campagne GoPhish complète en campagne dashboard
export function transformGoPhishCampaign(
    goPhishCampaign: any, // Campaign complet de GoPhish
    campaignInfo?: any     // Info additionnelle de ta BDD locale
): DashboardCampaign {
    // Transformer tous les results en targets
    const targets = (goPhishCampaign.results || []).map(transformGoPhishResult);

    // Calculer les stats à partir des targets
    const stats = calculateStatsFromTargets(targets);

    return {
        id: campaignInfo?.id || goPhishCampaign.id.toString(),
        name: goPhishCampaign.name,
        reference: `REF-${goPhishCampaign.id}`,
        date: goPhishCampaign.launch_date || goPhishCampaign.created_date,
        goPhishId: goPhishCampaign.id,
        status: goPhishCampaign.status,
        stats,
        targets,
    };
}

// Transformer un summary GoPhish (pour la liste)
export function transformGoPhishSummary(
    summary: GoPhishCampaignSummary,
    campaignInfo?: any
): DashboardCampaign {
    // Pour le summary, on n'a pas le détail des targets
    // On calcule les pourcentages à partir des stats globales
    const total = summary.stats.total || 1;

    return {
        id: campaignInfo?.id || summary.id.toString(),
        name: summary.name,
        reference: `REF-${summary.id}`,
        date: summary.launch_date || summary.created_date,
        goPhishId: summary.id,
        status: summary.status,
        stats: {
            opened: Math.round((summary.stats.opened / total) * 100),
            clicked: Math.round((summary.stats.clicked / total) * 100),
            submitted: Math.round((summary.stats.submitted_data / total) * 100),
        },
        targets: [], // Pas de targets dans le summary
    };
}

// Charger les détails d'une campagne quand on l'ouvre
export async function loadCampaignDetails(
    goPhishCampaignId: number,
    Client: any,
    ROUTES: any
): Promise<DashboardTarget[]> {
    try {
        // Appeler l'endpoint qui récupère la campagne complète de GoPhish
        const response = await Client.get(
            ROUTES.BACK.GOPHISH.CAMPAIGN_BY_ID(goPhishCampaignId)
        );

        const campaign = response.data;

        // Transformer tous les results
        const targets = (campaign.results || []).map(transformGoPhishResult);

        return targets;
    } catch (error) {
        console.error("Erreur chargement détails campagne:", error);
        return [];
    }
}

// Calculer les stats avec comparaison à la campagne précédente
export function calculateStatsWithComparison(
    campaigns: DashboardCampaign[]
): DashboardCampaign[] {
    if (campaigns.length <= 1) return campaigns;

    // Trier par date (plus récent en premier)
    const sorted = [...campaigns].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Ajouter les previousStats à chaque campagne
    return sorted.map((campaign, index) => {
        if (index < sorted.length - 1) {
            return {
                ...campaign,
                previousStats: sorted[index + 1].stats,
            };
        }
        return campaign;
    });
}