'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import Link from "next/link";

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, "Password should be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

const UserLoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const [loading, setLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState<string | null>(null);

    const router = useRouter()

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setLoginStatus(null);

        const result = await signIn('custom-provider', {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        console.log("resultttts", result);

        if (result?.error) {
            setLoading(false);
            setLoginStatus("You've entered wrong credentials, try again");
            // setLoginStatus(result.error || "An error occurred while logging in. Please try again.");
            toast.error( "You've entered wrong credentials, try again", {
            // toast.error(result.error || "Login failed", {
                style: {borderRadius: '10px', background: '#930218', color: '#fff'}
            });
            console.log("Error reslut", result);
        } else {
            setLoading(false);
            setLoginStatus("Login successful, redirecting...");
            toast.success("Login successful", {style: {borderRadius: '10px', background: '#05a116', color: '#fff'}});
            console.log("Sucess results", result);

            router.push("/");
            // router.push("/dashboard");

            // Handle redirection and other actions
            // if (result?.ok) {
            //     // Optionally call a function to update user info after login
            //     // await updateUserInfo();
            //
            //     // Redirect to the home page or another page
            //     router.push("/dashboard");
            // }
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex justify-center items-center">
                    {loading && <AiOutlineLoading3Quarters className="mr-2 animate-spin" />}
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {loginStatus && <p className="text-center text-green-500 mt-4">{loginStatus}</p>}
            </form>

            <Link className={'text-sm mt-8 text-blue-700'} href={'/signup'}>Click here to register</Link>
        </div>
    );
};

export default UserLoginForm;
