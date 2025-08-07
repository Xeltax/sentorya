export type User = {
    id: string;
    email: string;
    name: string;
    organizationName?: string | null;
    phoneNumber?: string | null;
    createdAt: Date;
    firstConnection: boolean;
    password: string;
    updatedAt: Date;
    lastLogin?: Date | null;
    role: "admin" | "user"
}