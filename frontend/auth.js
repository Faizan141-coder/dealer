import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import { pagesOptions } from "@/app/api/auth/[...nextauth]/pages-options";
import jwt_decode from "jwt-decode";

const authOptions = {
    pages: {
        ...pagesOptions,
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    },
    providers: [
        CredentialsProvider({
            id: "custom-provider",
            name: "CustomProvider",
            type: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/v1/user/token/', {
                    // const response = await axios.post(`${API_BASE_URL}auth/login/`, {
                        ...credentials,
                    });
                    console.log("response data 1", response.data);
                    const { access } = response.data;
                    // const decodedToken = jwt_decode(access);
                    // console.log("decodedToken", decodedToken);
                    return {
                        accessToken: access,
                        // ...decodedToken
                    };
                } catch (error) {
                    console.log("error1", error)
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    exp: user.exp,
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email: user.email,
                    username: user.username,
                    vendor_id: user.vendor_id
                };
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.user_id,
                name: token.full_name,
                email: token.email,
                username: token.username,
                vendor_id: token.vendor_id
            };
            session.accessToken = token.accessToken;
            session.error = token.exp < Date.now() / 1000 ? "Session expired. Sign in again." : null;
            return session;
        },
        async redirect({ url, baseUrl }) {
            const parsedUrl = new URL(url, baseUrl);
            if (parsedUrl.searchParams.has('callbackUrl')) {
                return `${baseUrl}${parsedUrl.searchParams.get('callbackUrl')}`;
            }
            if (parsedUrl.origin === baseUrl) {
                return url;
            }
            return baseUrl;
        },
    },
};

export default authOptions;