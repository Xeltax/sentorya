import mockData from '../mock/mockGoPhish.json';

export const getMockSummaries = () => {
    return mockData.summaries;
};

export const getMockCampaignDetails = (campaignId: number) => {
    console.log("Fetching mock campaign details for campaign ID:", campaignId);
    console.log(mockData.campaignDetails)
    return mockData.campaignDetails[campaignId.toString() as keyof typeof mockData.campaignDetails];
};