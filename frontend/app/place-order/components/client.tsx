// "use client";

// import { Plus } from "lucide-react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// import { columns, PlaceOrderColumn } from "./columns";
// import { AddModal } from "@/components/modals/add-modal";
// import { DataTable } from "@/components/ui/data-table";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// interface PlaceOrderClientProps {
//   data: PlaceOrderColumn[];
// }

// export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {
//   const [productName, setProductName] = useState("");
//   const [productType, setProductType] = useState("");
//   const [quantity, setQuantity] = useState(0);
//   const [deliveryDate, setDeliveryDate] = useState(new Date());
//   const [dealerUsername, setDealerUsername] = useState("");

//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();
//   const token = Cookies.get("authToken");

//   const onConfirm = async () => {
//     setLoading(true);
//     try {
//       await fetch(`http://127.0.0.1:8000/place-order/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           dealer_username: dealerUsername,
//           product_name: productName,
//           product_type: productType,
//           quantity: quantity,
//           delivery_date: deliveryDate,
//         }),
//       });
//       console.log("Order placed successfully");
//       router.refresh();
//     } catch (error: any) {
//       console.error("Error placing order:", error);
//     } finally {
//       setLoading(false);
//       setAddModalOpen(false);
//     }
//   };

//   const handleLogout = () => {
//     Cookies.remove("authToken");
//     Cookies.remove("userRole");
//     toast.success("Logged out successfully");
//     router.push("/");
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading title="Place Order" description={`Total (${data.length})`} />
//         <div className="flex space-x-2">
//           <Button
//             onClick={() => setAddModalOpen(true)}
//             className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md hover:bg-gray-800"
//           >
//             <Plus size={16} className="inline mr-2" />
//             Place Order
//           </Button>
//           <Button onClick={handleLogout} className="ml-4">
//             Logout
//           </Button>
//         </div>
//       </div>
//       <Separator />
//       <DataTable searchKey="product_name" columns={columns} data={data} />
//       <AddModal
//         isOpen={addModalOpen}
//         onClose={() => setAddModalOpen(false)}
//         onConfirm={onConfirm}
//         loading={loading}
//         dealerUsername={dealerUsername}
//         deliveryDate={deliveryDate}
//         productType={productType}
//         productName={productName}
//         quantity={quantity}
//         setDealerUsername={setDealerUsername}
//         setDeliveryDate={setDeliveryDate}
//         setProductType={setProductType}
//         setProductName={setProductName}
//         setQuantity={setQuantity}
//       />
//     </>
//   );
// };


"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, PlaceOrderColumn } from "./columns";
import { AddModal } from "@/components/modals/add-modal";
import { DataTable } from "@/components/ui/data-table";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SubProduct {
  product_name: string;
  product_type: string;
  quantity: number;
  delivery_date: Date;
  delivery_address: string;
}

interface PlaceOrderClientProps {
  data: PlaceOrderColumn[];
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {
  const [subProducts, setSubProducts] = useState<SubProduct[]>([]);
  const [dealerUsername, setDealerUsername] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const token = Cookies.get("authToken");

  const onConfirm = async () => {
    setLoading(true);
    try {
      await fetch(`http://127.0.0.1:8000/place-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dealer_username: dealerUsername,
          sub_products: subProducts.map(subProduct => ({
            ...subProduct,
            delivery_date: subProduct.delivery_date.toISOString().split("T")[0], // Format date
          })),
        }),
      });
      console.log("Order placed successfully");
      router.refresh();
    } catch (error: any) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
      setAddModalOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const addSubOrder = (subOrder: SubProduct) => {
    setSubProducts([...subProducts, subOrder]);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Place Order" description={`Total (${data.length})`} />
        <div className="flex space-x-2">
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md hover:bg-gray-800"
          >
            <Plus size={16} className="inline mr-2" />
            Add Sub-Order
          </Button>
          <Button onClick={handleLogout} className="ml-4">
            Logout
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable searchKey="product_name" columns={columns} data={data} />
      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={addSubOrder} // Use addSubOrder function to add sub-orders
        loading={loading}
        dealerUsername={dealerUsername}
        setDealerUsername={setDealerUsername}
        
      />
      <Button
        onClick={onConfirm}
        disabled={subProducts.length === 0 || loading}
        className="mt-4 bg-blue-600 text-white"
      >
        Place Order
      </Button>
    </>
  );
};
