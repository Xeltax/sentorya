import {Role} from "@prisma/client";

export type UserDTO = {
    email: string;
    name: string;
    organizationName?: string | null;
    phoneNumber?: string | null;
    password: string;
    role: Role;
}