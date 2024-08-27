// 'use client';
//
// import { useState } from 'react';
// import { z } from 'zod';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { signOut, useSession } from "next-auth/react";
//
// const orderSchema = z.object({
//   quantity: z.string().min(1, "Quantity is required"),
//   address: z.string().min(1, "Address is required"),
//   date: z.string().min(1, "Date is required"),
//   time: z.string().min(1, "Time is required"),
// });
//
// type Order = z.infer<typeof orderSchema>;
//
// const Dashboard = () => {
//   const { data: session } = useSession();
//
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [order, setOrder] = useState<Order>({ quantity: '', address: '', date: '', time: '' });
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setOrder({ ...order, [e.target.name]: e.target.value });
//   };
//
//   const handleAddOrder = () => {
//     try {
//       orderSchema.parse(order);
//       if (editIndex !== null) {
//         const updatedOrders = orders.map((o, index) =>
//             index === editIndex ? order : o
//         );
//         setOrders(updatedOrders);
//         setEditIndex(null);
//         toast.success("Order updated successfully");
//       } else {
//         setOrders([...orders, order]);
//         toast.success("Order added successfully");
//       }
//       setOrder({ quantity: '', address: '', date: '', time: '' });
//     } catch (e) {
//       if (e instanceof z.ZodError) {
//         e.errors.forEach((err) => toast.error(err.message));
//       }
//     }
//   };
//
//   const handleEditOrder = (index: number) => {
//     setOrder(orders[index]);
//     setEditIndex(index);
//   };
//
//   const handleRemoveOrder = (index: number) => {
//     setOrders(orders.filter((_, i) => i !== index));
//     toast.success("Order removed successfully");
//   };
//
//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/v1/orders/', orders, {
//         headers: {
//           Authorization: `Bearer ${(session as { accessToken?: string })?.accessToken}`,
//           "Content-Type": "application/json"
//         }
//       });
//       toast.success('Orders submitted successfully', {
//         style: {
//           borderRadius: '10px',
//           background: '#05a116',
//           color: '#fff',
//         }
//       });
//       setOrders([]);
//     } catch (error) {
//       toast.error('Error submitting orders');
//     }
//   };
//
//   return (
//       <div className="p-8 relative">
//         <button
//             type="button"
//             onClick={() => signOut()}
//             className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-red-700 rounded-lg hover:bg-blue-800
//         absolute top-4 right-4 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
//                stroke="currentColor" className="size-4 mr-2">
//             <path strokeLinecap="round" strokeLinejoin="round"
//                   d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
//           </svg>
//           Logout
//         </button>
//         <Toaster />
//         <div className={'w-[80%] mt-16 mx-auto'}>
//         <h1 className="text-2xl font-bold mt-16 mb-4">Buy Order</h1>
//         <div className="grid grid-cols-5 gap-4 border p-4">
//           <input
//               type="text"
//               name="quantity"
//               placeholder="Quantity/Loads"
//               value={order.quantity}
//               onChange={handleChange}
//               className="border p-2"
//           />
//           <input
//               type="text"
//               name="address"
//               placeholder="Delivery Address"
//               value={order.address}
//               onChange={handleChange}
//               className="border p-2"
//           />
//           <input
//               type="date"
//               name="date"
//               placeholder="Delivery Date"
//               value={order.date}
//               onChange={handleChange}
//               className="border p-2"
//           />
//           <input
//               type="time"
//               name="time"
//               placeholder="Delivery Time"
//               value={order.time}
//               onChange={handleChange}
//               className="border p-2"
//           />
//           <button
//               onClick={handleAddOrder}
//               className="bg-green-500 text-white p-2"
//           >
//             {editIndex !== null ? 'Update' : 'Add'}
//           </button>
//         </div>
//         <div className="mt-4">
//           {orders.map((o, index) => (
//               <div key={index} className="grid grid-cols-6 gap-4 border p-4 mt-2">
//                 <div>{o.quantity}</div>
//                 <div>{o.address}</div>
//                 <div>{o.date}</div>
//                 <div>{o.time}</div>
//                 <button
//                     onClick={() => handleEditOrder(index)}
//                     className="bg-yellow-500 text-white p-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                     onClick={() => handleRemoveOrder(index)}
//                     className="bg-red-500 text-white p-2"
//                 >
//                   Remove
//                 </button>
//               </div>
//           ))}
//         </div>
//         <button
//             onClick={handleSubmit}
//             className="bg-blue-500 text-white py-2 px-4 mt-4"
//         >
//           Submit
//         </button>
//         </div>
//
//       </div>
//   );
// };
//
// export default Dashboard;
//


// 'use client';
//
// import { useState } from 'react';
// import { z } from 'zod';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { signOut, useSession } from "next-auth/react";
//
// const loadSchema = z.object({
//   quantity: z.string().min(1, "Quantity is required"),
//   address: z.string().min(1, "Address is required"),
//   date: z.string().min(1, "Date is required"),
//   time: z.string().min(1, "Time is required"),
// });
//
// type Load = z.infer<typeof loadSchema>;
//
// const Dashboard = () => {
//   const { data: session } = useSession();
//
//   const [loads, setLoads] = useState<Load[]>([]);
//   const [load, setLoad] = useState<Load>({ quantity: '', address: '', date: '', time: '' });
//   const [editIndex, setEditIndex] = useState<number | null>(null);
//
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLoad({ ...load, [e.target.name]: e.target.value });
//   };
//
//   const handleAddLoad = () => {
//     try {
//       loadSchema.parse(load);
//       if (editIndex !== null) {
//         const updatedLoads = loads.map((l, index) =>
//             index === editIndex ? load : l
//         );
//         setLoads(updatedLoads);
//         setEditIndex(null);
//         toast.success("Load updated successfully");
//       } else {
//         setLoads([...loads, load]);
//         toast.success("Load added successfully");
//       }
//       setLoad({ quantity: '', address: '', date: '', time: '' });
//     } catch (e) {
//       if (e instanceof z.ZodError) {
//         e.errors.forEach((err) => toast.error(err.message));
//       }
//     }
//   };
//
//   const handleEditLoad = (index: number) => {
//     setLoad(loads[index]);
//     setEditIndex(index);
//   };
//
//   const handleRemoveLoad = (index: number) => {
//     setLoads(loads.filter((_, i) => i !== index));
//     toast.success("Load removed successfully");
//   };
//
//   const handleSubmit = async () => {
//     // console.log("session token", session?.accessToken)
//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/v1/orders/', { loads }, {
//         headers: {
//           Authorization: `Bearer ${(session as { accessToken?: string })?.accessToken}`,
//           "Content-Type": "application/json"
//         }
//       });
//       toast.success('Order submitted successfully', {
//         style: {
//           borderRadius: '10px',
//           background: '#05a116',
//           color: '#fff',
//         }
//       });
//       setLoads([]);
//     } catch (error) {
//       toast.error('Error submitting order');
//       console.log("Errors", error)
//     }
//   };
//
//   return (
//       <div className="p-8 relative">
//         <button
//             type="button"
//             onClick={() => signOut()}
//             className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-red-700 rounded-lg hover:bg-blue-800
//         absolute top-4 right-4 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
//                stroke="currentColor" className="size-4 mr-2">
//             <path strokeLinecap="round" strokeLinejoin="round"
//                   d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
//           </svg>
//           Logout
//         </button>
//         <Toaster />
//         <div className={'w-[80%] mt-16 mx-auto'}>
//           <h1 className="text-2xl font-bold mt-16 mb-4">Create Order</h1>
//           <div className="grid grid-cols-5 gap-4 border p-4">
//             <input
//                 type="text"
//                 name="quantity"
//                 placeholder="Quantity/Loads"
//                 value={load.quantity}
//                 onChange={handleChange}
//                 className="border p-2"
//             />
//             <input
//                 type="text"
//                 name="address"
//                 placeholder="Delivery Address"
//                 value={load.address}
//                 onChange={handleChange}
//                 className="border p-2"
//             />
//             <input
//                 type="date"
//                 name="date"
//                 placeholder="Delivery Date"
//                 value={load.date}
//                 onChange={handleChange}
//                 className="border p-2"
//             />
//             <input
//                 type="time"
//                 name="time"
//                 placeholder="Delivery Time"
//                 value={load.time}
//                 onChange={handleChange}
//                 className="border p-2"
//             />
//             <button
//                 onClick={handleAddLoad}
//                 className="bg-green-500 text-white p-2"
//             >
//               {editIndex !== null ? 'Update' : 'Add'}
//             </button>
//           </div>
//           <div className="mt-4">
//             {loads.map((l, index) => (
//                 <div key={index} className="grid grid-cols-6 gap-4 border p-4 mt-2">
//                   <div>{l.quantity}</div>
//                   <div>{l.address}</div>
//                   <div>{l.date}</div>
//                   <div>{l.time}</div>
//                   <button
//                       onClick={() => handleEditLoad(index)}
//                       className="bg-yellow-500 text-white p-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                       onClick={() => handleRemoveLoad(index)}
//                       className="bg-red-500 text-white p-2"
//                   >
//                     Remove
//                   </button>
//                 </div>
//             ))}
//           </div>
//           <button
//               onClick={handleSubmit}
//               className="bg-blue-500 text-white py-2 px-4 mt-4"
//           >
//             Submit Order
//           </button>
//         </div>
//
//       </div>
//   );
// };
//
// export default Dashboard;


'use client';

import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { signOut, useSession } from "next-auth/react";

const loadSchema = z.object({
  quantity: z.number().min(1, "Quantity is required"),
  address: z.string().min(1, "Address is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
});

type Load = z.infer<typeof loadSchema>;

const Dashboard = () => {
  const { data: session } = useSession();

  const [loads, setLoads] = useState<Load[]>([]);
  const [load, setLoad] = useState<Omit<Load, 'quantity'> & { quantity: string }>({ quantity: '', address: '', date: '', time: '' });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoad({ ...load, [e.target.name]: e.target.value });
  };

  const handleAddLoad = () => {
    try {
      const parsedLoad = { ...load, quantity: parseInt(load.quantity) };
      loadSchema.parse(parsedLoad);
      if (editIndex !== null) {
        const updatedLoads = loads.map((l, index) =>
            index === editIndex ? parsedLoad : l
        );
        setLoads(updatedLoads);
        setEditIndex(null);
        toast.success("Load updated successfully");
      } else {
        setLoads([...loads, parsedLoad]);
        toast.success("Load added successfully");
      }
      setLoad({ quantity: '', address: '', date: '', time: '' });
    } catch (e) {
      if (e instanceof z.ZodError) {
        e.errors.forEach((err) => toast.error(err.message));
      }
    }
  };

  const handleEditLoad = (index: number) => {
    const editLoad = loads[index];
    setLoad({ ...editLoad, quantity: editLoad.quantity.toString() });
    setEditIndex(index);
  };

  const handleRemoveLoad = (index: number) => {
    setLoads(loads.filter((_, i) => i !== index));
    toast.success("Load removed successfully");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/orders/', { loads }, {
        headers: {
          Authorization: `Bearer ${(session as { accessToken?: string })?.accessToken}`,
          "Content-Type": "application/json"
        }
      });
      toast.success('Order submitted successfully', {
        style: {
          borderRadius: '10px',
          background: '#05a116',
          color: '#fff',
        }
      });
      setLoads([]);
    } catch (error) {
      toast.error('Error submitting order');
    }
  };

  return (
      <div className="p-8 relative">
        <button
            type="button"
            onClick={() => signOut()}
            className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-red-700 rounded-lg hover:bg-blue-800
        absolute top-4 right-4 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
               stroke="currentColor" className="size-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Logout
        </button>
        <Toaster />
        <div className={'w-[80%] mt-16 mx-auto'}>
          <h1 className="text-2xl font-bold mt-16 mb-4">Create Order</h1>
          <div className="grid grid-cols-5 gap-4 border p-4">
            <input
                type="number"
                name="quantity"
                placeholder="Quantity/Loads"
                value={load.quantity}
                onChange={handleChange}
                className="border p-2"
            />
            <input
                type="text"
                name="address"
                placeholder="Delivery Address"
                value={load.address}
                onChange={handleChange}
                className="border p-2"
            />
            <input
                type="date"
                name="date"
                placeholder="Delivery Date"
                value={load.date}
                onChange={handleChange}
                className="border p-2"
            />
            <input
                type="time"
                name="time"
                placeholder="Delivery Time"
                value={load.time}
                onChange={handleChange}
                className="border p-2"
            />
            <button
                onClick={handleAddLoad}
                className="bg-green-500 text-white p-2"
            >
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
          <div className="mt-4">
            {loads.map((l, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 border p-4 mt-2">
                  <div>{l.quantity}</div>
                  <div>{l.address}</div>
                  <div>{l.date}</div>
                  <div>{l.time}</div>
                  <button
                      onClick={() => handleEditLoad(index)}
                      className="bg-yellow-500 text-white p-2"
                  >
                    Edit
                  </button>
                  <button
                      onClick={() => handleRemoveLoad(index)}
                      className="bg-red-500 text-white p-2"
                  >
                    Remove
                  </button>
                </div>
            ))}
          </div>
          <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 mt-4"
          >
            Submit Order
          </button>
        </div>

      </div>
  );
};

export default Dashboard;

