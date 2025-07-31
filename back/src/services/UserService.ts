import {UserRepository} from "../repositories/UserRepository";
import {UserDTO} from "../DTO/UserDTO";
import {User} from "../types";
import {hash, compare} from "bcrypt";

export class UserService {
    private userRepository: UserRepository = new UserRepository();

    async createUser(data: UserDTO): Promise<User> {
        console.log("Creating user with data:", data.email);
        const existingUser = await this.userRepository.getByEmail(data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        data.password = await this.hashPassword(data.password);

        return await this.userRepository.save(data);
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.userRepository.getByEmail(email);
    }

    async getAllUsers() {
        return await this.userRepository.getAll();
    }

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }
}