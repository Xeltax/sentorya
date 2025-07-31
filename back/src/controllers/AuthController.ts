import { Request, Response } from "express";
import {AuthService} from "../services/auth.service";
import {hash, compare} from "bcrypt";
import * as jwt from "jsonwebtoken";
import {User} from "../types";
import {AuthDTO} from "../DTO/AuthDTO";

const authService = new AuthService()

export class AuthController {

    static async login(req: Request, res: Response)  {
        try {
            const {user, token} = await authService.login(req.body);
            res.status(200).json({ user, token });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}