export const ROUTES = {
    BACK : {
        USER : {
            CRUD : "/user"
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