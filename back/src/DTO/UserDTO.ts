import {Role} from "@prisma/client";

export type UserDTO = {
    email: string;
    name: string;
    password: string;
    role: Role;
}