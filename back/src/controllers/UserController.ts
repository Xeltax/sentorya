import { Request, Response } from "express";
import {UserService} from "../services/UserService";
import {UserDTO} from "../DTO/UserDTO";

const userService = new UserService();

export class UserController {

    static async createUser(req: Request, res: Response) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await userService.getById(userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateUser(req: Request, res: Response) {
        try {
            const user = await userService.getById(req.body.id)
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const updatedUser = await userService.updateUser(user, req.body as Partial<UserDTO>);
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).json({ message: "Can't update user correctly" });
            }
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            await userService.deleteUser(userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}