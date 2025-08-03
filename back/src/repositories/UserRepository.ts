import {User} from "../models/User";
import {User as UserTypes} from "../types";
import prisma from "../prisma";
import {UserDTO} from "../DTO/UserDTO";

export class UserRepository {
    async getByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {email},
        });
    }

    async getById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {id},
        });
    }

    async getAll(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async save(user: UserDTO): Promise<User> {
        return prisma.user.create({
            data: user,
        });
    }

    async update(user: UserTypes, data: Partial<UserDTO>): Promise<User | null> {
        const email = user.email;
        return prisma.user.update({
            where: {email},
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
}