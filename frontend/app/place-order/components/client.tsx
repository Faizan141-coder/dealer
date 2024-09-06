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
  const [selectedSubProduct, setSelectedSubProduct] =
    useState<SubProduct | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dealerUsername, setDealerUsername] = useState("");

  const router = useRouter();
  const token = Cookies.get("authToken");

  const onConfirm = async () => {
    setLoading(true);
    try {
      await fetch(`https://dealer-backend-kz82.vercel.app/place-order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dealer_username: dealerUsername,
          sub_products: subProducts.map((subProduct) => ({
            ...subProduct,
            delivery_date: subProduct.delivery_date, // Format date
          })),
        }),
      });
      console.log("Order placed successfully");
      setSubProducts([]); // Clear sub-orders after placing the order
      router.refresh();
    } catch (error: any) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
      setAddModalOpen(false);
    }
  };

  const handleAddSubOrder = (subOrder: SubProduct) => {
    if (selectedSubProduct) {
      setSubProducts(
        subProducts.map((sp) => (sp === selectedSubProduct ? subOrder : sp))
      );
    } else {
      setSubProducts([...subProducts, subOrder]);
    }
    setSelectedSubProduct(null); // Reset selection after editing or adding
  };

  const handleEditSubOrder = (subOrder: SubProduct) => {
    setSelectedSubProduct(subOrder);
    setAddModalOpen(true);
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title="Place Order"
          description={`Total Products: ${data.length}`}
        />
        <div className="flex space-x-4">
          <Button
            onClick={() => {
              setSelectedSubProduct(null);
              setAddModalOpen(true);
            }}
            className="bg-blue-600 text-white text-sm px-5 py-3 rounded-md hover:bg-blue-500"
          >
            <Plus size={16} className="inline mr-2" />
            Add Sub-Order
          </Button>
          <Button
            onClick={onConfirm}
            disabled={subProducts.length === 0 || loading}
            className="bg-green-600 text-white text-sm px-5 py-3 rounded-md hover:bg-green-500 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
          <Button onClick={handleLogout} className="ml-4">
            Logout
          </Button>
        </div>
      </div>
      <Separator />

      {subProducts.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Sub-Orders</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subProducts.map((subProduct, index) => (
              <div key={index} className="p-4 bg-white shadow-md rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-semibold">
                      {subProduct.product_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Delivery Date: {subProduct.delivery_date.toString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleEditSubOrder(subProduct)}
                    className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-md hover:bg-yellow-400"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <DataTable searchKey="product_name" columns={columns} data={data} />
      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleAddSubOrder}
        loading={loading}
        initialSubOrder={selectedSubProduct}
        dealerUsername={dealerUsername}
        setDealerUsername={setDealerUsername}
      />
    </>
  );
};
