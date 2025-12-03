export const ROUTES = {
    BACK : {
        USER : {
            CRUD : "/user"
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
        },
        AUTH : {
            LOGIN: "/auth/login",
            LOGOUT: "/auth/logout",
            FORGOT_PASSWORD: "/auth/forgot-password",
        }
    }
}