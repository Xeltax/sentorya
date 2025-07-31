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
}