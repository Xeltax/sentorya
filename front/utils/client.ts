import axios from 'axios';
import {getCookie} from "cookies-next";

const isServer = typeof window === 'undefined'

const Client = axios.create({
    baseURL: isServer
        ? process.env.API_URL        // SSR / getServerSideProps
        : process.env.NEXT_PUBLIC_API_URL,  // client-side
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