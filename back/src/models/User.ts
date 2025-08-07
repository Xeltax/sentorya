import {User as PrismaUser, Role} from '@prisma/client';

export interface User extends PrismaUser {
    id : string;
    email: string;
    name: string;
    organizationName?: string | null;
    phoneNumber?: string | null;
    password: string;
    firstConnection: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    role: Role;
    lastLogin?: Date | null;
}