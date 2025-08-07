import {UserRepository} from "../repositories/UserRepository";
import {hash, compare} from "bcrypt";
import {CampaignRepository} from "../repositories/CampaignRepository";
import {CampaignDTO} from "../DTO/CampaignDTO";
import {Campaign} from "../models/Campaign";

export class CampaignService {
    private campaignRepository: CampaignRepository = new CampaignRepository();

    async createCampaign(data: CampaignDTO): Promise<Campaign> {
        console.log("Creating user with data:", data.campaignId);
        const existingCampaign = await this.campaignRepository.getByCampaignId(data.campaignId);
        if (existingCampaign) {
            throw new Error("Campaign already exists");
        }

        return await this.campaignRepository.save(data);
    }

    async getById(id: string): Promise<Campaign | null> {
        return await this.campaignRepository.getById(id);
    }

    async getByCampaignId(campaignId: string): Promise<Campaign | null> {
        return await this.campaignRepository.getByCampaignId(campaignId);
    }

    async getAllCampaign() {
        return await this.campaignRepository.getAll();
    }

    async updateCampaign(user: Campaign, data: Partial<CampaignDTO>): Promise<Campaign | null> {
        return await this.campaignRepository.update(user, data);
    }

    async deleteCampaign(id: string): Promise<void> {
        await this.campaignRepository.delete(id);
    }

    async addUserToCampaign(campaignId: string, userId: string): Promise<Campaign | null> {
        const campaign = await this.campaignRepository.getByCampaignId(campaignId);
        if (!campaign) {
            throw new Error("Campaign not found");
        }

        if (campaign.users.some(user => user.id === userId)) {
            throw new Error("User already in campaign");
        }

        return await this.campaignRepository.addUserToCampaign(campaignId, userId);
    }

    async removeUserFromCampaign(campaignId: string, userId: string): Promise<Campaign | null> {
        const campaign = await this.campaignRepository.getByCampaignId(campaignId);
        if (!campaign) {
            throw new Error("Campaign not found");
        }

        if (!campaign.users.some(user => user.id === userId)) {
            throw new Error("User not in campaign");
        }

        return await this.campaignRepository.removeUserFromCampaign(campaignId, userId);
    }
}