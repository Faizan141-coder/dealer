'use client'
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {useRouter} from "next/navigation";

const states = [
    ["NY", "New York"],
    ["CA", "California"],
    ["TX", "Texas"],
];

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    full_name: z.string().min(1, "Full name is required"),
    phone: z.string().min(10, "Phone number should be at least 10 digits").max(15),
    password: z.string().min(8, "Password should be at least 8 characters"),
    confirm_password: z.string().min(8, "Password should be at least 8 characters"),
    profile: z.object({
        company_name: z.string().min(1, "Company name is required"),
        address: z.string().min(1, "Address is required"),
        country: z.string().min(1, "Country is required"),
        state: z.string().min(1, "State is required"),
        city: z.string().min(1, "City is required"),
        zip_code: z.string().min(5, "ZIP code should be at least 5 digits"),
    }),
}).refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});

type FormData = z.infer<typeof schema>;

const RegistrationUserForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/user/signup/', data);
            toast.success(`User registered successfully: ${response.data.full_name}, proceed to login`, {
            // toast.success(`User registered successfully: ${response.data.full_name}, proceed to login`, {
                style: {
                    borderRadius: '10px',
                    background: '#05a116',
                    color: '#fff',
                }
            });
            router.push('/login')
        } catch (error : any) {
            toast.error(`Error: ${error.response?.data?.error || 'Unknown error'}`, {
                style: {
                    borderRadius: '10px',
                    background: '#930218',
                    color: '#fff',
                },
            });
            console.log("Error", error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
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
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            {...register('full_name')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name.message}</p>}
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            {...register('phone')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>
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
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirm_password')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.confirm_password && <p className="text-red-500 text-xs">{errors.confirm_password.message}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            {...register('profile.company_name')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.profile?.company_name && <p className="text-red-500 text-xs">{errors.profile.company_name.message}</p>}
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            {...register('profile.address')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.profile?.address && <p className="text-red-500 text-xs">{errors.profile.address.message}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            {...register('profile.country')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.profile?.country && <p className="text-red-500 text-xs">{errors.profile.country.message}</p>}
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <select
                            {...register('profile.state')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select a state</option>
                            {states.map(([code, name]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </select>
                        {errors.profile?.state && <p className="text-red-500 text-xs">{errors.profile.state.message}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            {...register('profile.city')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.profile?.city && <p className="text-red-500 text-xs">{errors.profile.city.message}</p>}
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                        <input
                            type="text"
                            {...register('profile.zip_code')}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                        {errors.profile?.zip_code && <p className="text-red-500 text-xs">{errors.profile.zip_code.message}</p>}
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex justify-center items-center">
                    {loading && <AiOutlineLoading3Quarters className="mr-2 animate-spin" />}
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationUserForm;
