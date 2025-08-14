import { Request, Response } from "express";
import {CampaignService} from "../services/CampaignService";

const campaignService = new CampaignService();

export class CampaignController {

    static async createCampaign(req: Request, res : Response) {
        try {
            const { name, campaignId } = req.body;
            if (!name || !campaignId) {
                return res.status(400).json({ message: "Name and campaignId are required" });
            }
            const newCampaign = await campaignService.createCampaign({ name, campaignId });
            res.status(201).json(newCampaign);
        } catch (error : any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCampaignById(req: Request, res : Response) {
        try {
            const id = req.params.id;
            const campaign = await campaignService.getById(id);
            if (campaign) {
                res.status(200).json(campaign);
            } else {
                res.status(404).json({ message: "Campaign not found" });
            }
        } catch (error : any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateCampaign(req: Request, res : Response) {
        try {
            const campaignId = req.params.id;
            const campaign = await campaignService.getById(campaignId);
            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
            const updatedCampaign = await campaignService.updateCampaign(campaign, req.body);
            if (updatedCampaign) {
                res.status(200).json(updatedCampaign);
            } else {
                res.status(404).json({ message: "Campaign not found" });
            }
        } catch (error : any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteCampaign(req: Request, res : Response) {
        try {
            const campaignId = req.params.id;
            await campaignService.deleteCampaign(campaignId);
            res.status(204).send();
        } catch (error : any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addUserToCampaign(req: Request, res : Response) {
        try {
            const { campaignId, userId } = req.body;
            const updatedCampaign = await campaignService.addUserToCampaign(campaignId, userId);
            res.status(200).json(updatedCampaign);
        } catch (error : any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async removeUserFromCampaign(req: Request, res : Response) {
        try {
            const { campaignId, userId } = req.body;
            const updatedCampaign = await campaignService.removeUserFromCampaign(campaignId, userId);
            res.status(200).json(updatedCampaign);
        } catch (error : any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getCampaignByCampaignId(req: Request, res : Response) {
        try {
            const campaignId = req.params.campaignId;
            const campaign = await campaignService.getByCampaignId(campaignId);
            if (campaign) {
                res.status(200).json(campaign);
            } else {
                res.status(404).json({ message: "Campaign not found" });
            }
        } catch (error: any ) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllCampaigns(req: Request, res : Response) {
        try {
            const campaigns = await campaignService.getAllCampaign();
            res.status(200).json(campaigns);
        } catch (error : any) {
            res.status(500).json({ error: error.message });
        }
    }
}