export const ROUTES = {
    BACK : {
        USER : {
            CRUD : "/user",
            RESET_PASSWORD : "/user/reset-password",
        },
        ORGANIZATION : {
            CRUD : "/organizations",
            GET_BY_ID : (id: string) => `/organizations/${id}`,
            GET_BY_OWNER_ID : (ownerId: string) => `/organizations/by-owner/${ownerId}`,
            ADD_MEMBER : "/organizations/add-member",
            REMOVE_MEMBER : "/organizations/remove-member",
            GET_MEMBERS : (organizationId: string) => `/organizations/${organizationId}/members`,
        },
        CAMPAIGN : {
            CRUD : "/campaign",
            GET_BY_ID : (id: string) => `/campaign/${id}`,
            GET_RESULTS : (id: string) => `/campaign/${id}/results`,
        },
        GOPHISH : {
            TEMPLATES : "/gophish/templates",
            PAGES : "/gophish/pages",
            SMTP : "/gophish/smtp",
            GROUPS : "/gophish/groups",
            CAMPAIGNS : "/gophish/campaigns",
            CAMPAIGN_BY_ID : (id: number) => `/gophish/campaigns/${id}`,
            CAMPAIGN_SUMMARY : (id: number) => `/gophish/campaigns/${id}/summary`,
            COMPLETE_CAMPAIGN : (id: number) => `/gophish/campaigns/${id}/complete`,
        },
        AUTH : {
            CHANGE_PASSWORD_FIRST_LOGIN : "/auth/change-password",
            LOGIN: "/auth/login",
            LOGOUT: "/auth/logout",
            FORGOT_PASSWORD: "/auth/forgot-password",
        }
    }
}