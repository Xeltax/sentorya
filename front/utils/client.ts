import axios from 'axios';
import {getCookie} from "cookies-next";

const Client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

Client.interceptors.request.use(
    (config) => {
        const cookie = getCookie("JWT");

        if (typeof cookie === "string") {
            config.headers['Authorization'] = `Bearer ${cookie}`
        }
        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);

export function setBearerToken(token: string) {
    if (token) {
        Client.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
        delete Client.defaults.headers['Authorization'];
    }
}

export default Client;