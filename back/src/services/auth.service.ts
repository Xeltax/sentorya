import {UserRepository} from "../repositories/UserRepository";
import {compare} from "bcrypt";
import * as jwt from "jsonwebtoken";
import {User} from "../models/User";

export class AuthService {
    private userRepository: UserRepository = new UserRepository();

    async login(credentials : {email : string, password : string}): Promise<{ user: User; token: string; }> {
        const user = await this.userRepository.getByEmail(credentials.email);
        if (!user) {
            throw new Error("Compte non trouvé");
        }

        if (user.firstConnection) {
            user.firstConnection = false
        }

        user.lastLogin = new Date();

        await this.userRepository.update(user, user);

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect");
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