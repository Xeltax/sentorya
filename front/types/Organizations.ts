type Organizations = {
    id: string;
    name: string;
    email : string;
    address?: string | null;
    phoneNumber?: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}