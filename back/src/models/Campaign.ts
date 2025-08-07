import {Campaign as PrismaCampaign} from "@prisma/client";
import {User} from "./User";

export interface Campaign extends PrismaCampaign {
    id: string,
    name : string,
    campaignId : string,
    users : User[]
}