import axios from 'axios';
import {getSession} from "next-auth/react";
import {Session} from "next-auth";


export const appApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL
});

appApi.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session && (session as Session & { accessToken: string }).accessToken) {
            config.headers.Authorization = `JWT ${(session as Session & { accessToken: string }).accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);




export const appMediaApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        'Content-Type': 'multipart/form-data' ,accept: 'application/json',
    },
});

appMediaApi.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (session && (session as Session & { accessToken: string }).accessToken) {
            config.headers.Authorization = `JWT ${(session as Session & { accessToken: string }).accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


