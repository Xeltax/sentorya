import {User} from "@/types/User";

export type Campaign = {
    id: string,
    name : string,
    campaignId : string,
    users : User[]
}