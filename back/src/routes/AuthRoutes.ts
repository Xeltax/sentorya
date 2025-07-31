import { Router } from 'express';
import {UserController} from "../controllers/UserController";
import {AuthController} from "../controllers/AuthController";
import {authenticateJWT} from "../middleware/AuthMiddleware";

const router = Router();

router.post("/login", AuthController.login);

export default router;