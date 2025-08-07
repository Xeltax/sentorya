import prisma from "../prisma";
import {CampaignDTO} from "../DTO/CampaignDTO";
import {Campaign} from "../models/Campaign";

export class CampaignRepository {

    async getById(id: string): Promise<Campaign | null> {
        return prisma.campaign.findUnique({
            where: {id},
            include: {
                users: true, // Include users associated with the campaign
            },
        });
    }

    async getByCampaignId(campaignId: string): Promise<Campaign | null> {
        return prisma.campaign.findUnique({
            where: { campaignId },
            include: {
                users: true, // Include users associated with the campaign
            },
        });
    }

    async getAll(): Promise<Campaign[]> {
        return prisma.campaign.findMany({
            include: {
                users: true, // Include users associated with the campaign
            },
        });
    }

    async save(campaign: CampaignDTO): Promise<Campaign> {
        return prisma.campaign.create({
            data: campaign,
            include: {
                users: true, // Include users associated with the campaign
            },
        });
    }

    async update(campaign: Campaign, data: Partial<CampaignDTO>): Promise<Campaign | null> {
        const id = campaign.id;
        return prisma.campaign.update({
            where: {id},
            data: {
                ...data,
            },
            include: {
                users: true, // Include users associated with the campaign
            },
        });
    }

    async addUserToCampaign(campaignId: string, userId: string): Promise<Campaign | null> {
        return prisma.campaign.update({
            where: { campaignId },
            data: {
                users: {
                    connect: { id: userId }
                }
            },
            include: {
                users: true,
            },
        });
    }

    async removeUserFromCampaign(campaignId: string, userId: string): Promise<Campaign | null> {
        return prisma.campaign.update({
            where: { campaignId },
            data: {
                users: {
                    disconnect: { id: userId }
                }
            },
            include: {
                users: true,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.campaign.delete({
            where: { id },
        });
    }
}