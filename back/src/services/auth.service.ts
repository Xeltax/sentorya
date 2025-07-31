import httpClient from './httpClient.service';
import { config } from '../config';
import { User } from '../types';
import {UserRepository} from "../repositories/UserRepository";
import {compare} from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthService {
    private userRepository: UserRepository = new UserRepository();

    async login(credentials : {email : string, password : string}): Promise<{ user: User; token: string; }> {
        const user = await this.userRepository.getByEmail(credentials.email);
        if (!user) {
            throw new Error("User does not exist");
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = jwt.sign({
            email: user.email,
            name: user.name,
            role: user.role,
            userId: user.id,
            // @ts-ignore
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return { user, token };
    }
}