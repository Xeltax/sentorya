import { Router } from 'express';
import {UserController} from "../controllers/UserController";
import {authenticateJWT} from "../middleware/AuthMiddleware";

const router = Router();

router.get("", authenticateJWT, UserController.getAllUsers);
router.get("/:id", authenticateJWT, UserController.getUserById);
router.put("", authenticateJWT, UserController.updateUser);
router.post("", UserController.createUser);
router.delete("/:id", authenticateJWT, UserController.deleteUser);

export default router;