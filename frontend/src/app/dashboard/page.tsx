'use client';

// import React, { useState } from 'react';
// import { z } from 'zod';
//
// const orderSchema = z.object({
//     quantity: z.number().positive(),
//     deliveryAddress: z.string().min(1),
//     deliveryDate: z.string().min(1),
//     deliveryTime: z.string().min(1),
// });
//
// type Order = z.infer<typeof orderSchema>;
//
// const OrderDashboard: React.FC = () => {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({});
//
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setCurrentOrder({
//             ...currentOrder,
//             [e.target.name]: e.target.value,
//         });
//     };
//
//     const handleAddOrder = () => {
//         try {
//             const validatedOrder = orderSchema.parse(currentOrder);
//             setOrders([...orders, validatedOrder]);
//             setCurrentOrder({});
//         } catch (error) {
//             console.error('Invalid order:', error);
//             // Handle validation error (e.g., show error message to user)
//         }
//     };
//
//     const handleSubmitOrders = async () => {
//         try {
//             const response = await fetch('/api/orders', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orders),
//             });
//             if (response.ok) {
//                 setOrders([]);
//                 // Show success message
//             } else {
//                 // Handle error
//             }
//         } catch (error) {
//             console.error('Error submitting orders:', error);
//             // Handle network error
//         }
//     };
//
//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Buy Order</h1>
//             <div className="mb-4">
//                 <input
//                     type="number"
//                     name="quantity"
//                     placeholder="Quantity/Loads"
//                     value={currentOrder.quantity || ''}
//                     onChange={handleInputChange}
//                     className="mr-2 p-2 border rounded"
//                 />
//                 <input
//                     type="text"
//                     name="deliveryAddress"
//                     placeholder="Delivery Address"
//                     value={currentOrder.deliveryAddress || ''}
//                     onChange={handleInputChange}
//                     className="mr-2 p-2 border rounded"
//                 />
//                 <input
//                     type="date"
//                     name="deliveryDate"
//                     value={currentOrder.deliveryDate || ''}
//                     onChange={handleInputChange}
//                     className="mr-2 p-2 border rounded"
//                 />
//                 <input
//                     type="time"
//                     name="deliveryTime"
//                     value={currentOrder.deliveryTime || ''}
//                     onChange={handleInputChange}
//                     className="mr-2 p-2 border rounded"
//                 />
//                 <button
//                     onClick={handleAddOrder}
//                     className="bg-green-500 text-white p-2 rounded"
//                 >
//                     Add
//                 </button>
//             </div>
//             <table className="w-full border-collapse border">
//                 <thead>
//                 <tr>
//                     <th className="border p-2">Quantity/Loads</th>
//                     <th className="border p-2">Delivery Address</th>
//                     <th className="border p-2">Delivery Date</th>
//                     <th className="border p-2">Delivery Time</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {orders.map((order, index) => (
//                     <tr key={index}>
//                         <td className="border p-2">{order.quantity}</td>
//                         <td className="border p-2">{order.deliveryAddress}</td>
//                         <td className="border p-2">{order.deliveryDate}</td>
//                         <td className="border p-2">{order.deliveryTime}</td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//             <button
//                 onClick={handleSubmitOrders}
//                 className="mt-4 bg-blue-500 text-white p-2 rounded"
//             >
//                 Submit Orders
//             </button>
//         </div>
//     );
// };
//
// export default OrderDashboard;

import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {useSession} from "next-auth/react";

const orderSchema = z.object({
    quantity: z.string().min(1, "Quantity is required"),
    address: z.string().min(1, "Address is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
});

type Order = z.infer<typeof orderSchema>;

const Dashboard = () => {

    const {data: session} = useSession()

    console.log("Session", session)

    const [orders, setOrders] = useState<Order[]>([]);
    const [order, setOrder] = useState<Order>({ quantity: '', address: '', date: '', time: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleAddOrder = () => {
        try {
            orderSchema.parse(order);
            setOrders([...orders, order]);
            setOrder({ quantity: '', address: '', date: '', time: '' });
            toast.success("Order added successfully");
        } catch (e) {
            if (e instanceof z.ZodError) {
                e.errors.forEach((err) => toast.error(err.message));
            }
        }
    };

    const handleSubmit = async () => {
        console.log("Oreder", orders)
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/orders/', orders, {
                // headers: {
                //     Authorization: `Bearer ${session?.accessToken}`,
                //     "Content-Type": "application/json"
                // }
            });
            toast.success('Orders submitted successfully', {
                style: {
                    borderRadius: '10px',
                    background: '#05a116',
                    color: '#fff',
                }
            });
            setOrders([]);
        } catch (error) {
            toast.error('Error submitting orders');
        }
    };

    return (
        <div className="p-8">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">Buy Order</h1>
            <div className="grid grid-cols-5 gap-4 border p-4">
                <input
                    type="text"
                    name="quantity"
                    placeholder="Quantity/Loads"
                    value={order.quantity}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Delivery Address"
                    value={order.address}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="date"
                    name="date"
                    placeholder="Delivery Date"
                    value={order.date}
                    onChange={handleChange}
                    className="border p-2"
                />
                <input
                    type="time"
                    name="time"
                    placeholder="Delivery Time"
                    value={order.time}
                    onChange={handleChange}
                    className="border p-2"
                />
                <button
                    onClick={handleAddOrder}
                    className="bg-green-500 text-white p-2"
                >
                    Add
                </button>
            </div>
            <div className="mt-4">
                {orders.map((o, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 border p-4 mt-2">
                        <div>{o.quantity}</div>
                        <div>{o.address}</div>
                        <div>{o.date}</div>
                        <div>{o.time}</div>
                    </div>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 mt-4"
            >
                Submit
            </button>
        </div>
    );
};

export default Dashboard;
