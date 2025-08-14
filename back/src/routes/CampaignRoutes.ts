import { Router } from 'express';
import {UserController} from "../controllers/UserController";
import {authenticateJWT} from "../middleware/AuthMiddleware";
import {CampaignController} from "../controllers/CampaignController";

const router = Router();

router.get("", authenticateJWT, CampaignController.getAllCampaigns);
router.get("/:id", authenticateJWT, CampaignController.getCampaignById);
router.get("/byCampain/:id", authenticateJWT, CampaignController.getCampaignByCampaignId);
router.put("/:id", authenticateJWT, CampaignController.updateCampaign);
router.put("/addUser", authenticateJWT, CampaignController.addUserToCampaign);
router.put("/removeUser", authenticateJWT, CampaignController.removeUserFromCampaign);
router.delete("/:id", authenticateJWT, CampaignController.deleteCampaign);
router.post("", CampaignController.createCampaign);

export default router;