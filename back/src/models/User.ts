import {User as PrismaUser, Role} from '@prisma/client';

export interface User extends PrismaUser {
    id : string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    role: Role;
}