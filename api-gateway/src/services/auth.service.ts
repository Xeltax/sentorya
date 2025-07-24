import httpClient from './httpClient.service';
import { config } from '../config';
import { AuthTokens, User } from '../types';

class AuthService {
    private baseUrl = config.services.auth;

    async validateToken(token: string): Promise<User> {
        const response = await httpClient.post(`${this.baseUrl}/auth/validate`, {
            token,
        });
        return response.data.data;
    }

    async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
        const response = await httpClient.post(`${this.baseUrl}/auth/login`, {
            email,
            password,
        });
        return response.data.data;
    }

    async register(userData: { email: string; password: string; name: string }): Promise<{ user: User; tokens: AuthTokens }> {
        const response = await httpClient.post(`${this.baseUrl}/auth/register`, userData);
        return response.data.data;
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const response = await httpClient.post(`${this.baseUrl}/auth/refresh`, {
            refreshToken,
        });
        return response.data.data;
    }

    async logout(refreshToken: string): Promise<void> {
        await httpClient.post(`${this.baseUrl}/auth/logout`, {
            refreshToken,
        });
    }
}

export default new AuthService();