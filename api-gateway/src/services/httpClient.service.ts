import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import logger from '../utils/logger';

class HttpClientService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            (config : any) => {
                logger.info(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
                return config;
            },
            (error: any) => {
                logger.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response: any) => {
                return response;
            },
            (error: any) => {
                logger.error('Response error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    async get(url: string, config?: AxiosRequestConfig) {
        return this.client.get(url, config);
    }

    async post(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.client.post(url, data, config);
    }

    async put(url: string, data?: any, config?: AxiosRequestConfig) {
        return this.client.put(url, data, config);
    }

    async delete(url: string, config?: AxiosRequestConfig) {
        return this.client.delete(url, config);
    }
}

export default new HttpClientService();