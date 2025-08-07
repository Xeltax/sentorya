export type UserJWT = {
    email: string
    exp: number
    iat: number
    name: string
    role: "USER" | "ADMIN"
    userId: string
}