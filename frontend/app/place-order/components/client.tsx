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

interface PlaceOrderClientProps {
  data: PlaceOrderColumn[];
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  // const [address, setAddress] = useState("");
  const [dealerUsername, setDealerUsername] = useState("");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter()
  const token = Cookies.get("authToken");
  // console.log("Token: ", token);

  // console.log("Product Name: ", productName);
  // console.log("Product Type: ", productType);
  // console.log("Quantity: ", quantity);
  // console.log("Delivery Date: ", deliveryDate);
  // console.log("Address: ", address);
  // console.log("Dealer Username: ", dealerUsername);

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
          product_name: productName,
          product_type: productType,
          quantity: quantity,
          delivery_date: deliveryDate,
          // delivery_address: address,
          dealer_username: dealerUsername,
        }),
      });
      console.log("Order placed successfully");
      router.refresh()
    } catch (error: any) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
      setAddModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Place Order" description={`Total (${data.length})`} />
        <div>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md hover:bg-gray-800"
          >
            <Plus size={16} className="inline mr-2" />
            Place Order
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable searchKey="product_name" columns={columns} data={data} />
      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        // address={address}
        dealerUsername={dealerUsername}
        deliveryDate={deliveryDate}
        productType={productType}
        productName={productName}
        quantity={quantity}
        // setAddress={setAddress}
        setDealerUsername={setDealerUsername}
        setDeliveryDate={setDeliveryDate}
        setProductType={setProductType}
        setProductName={setProductName}
        setQuantity={setQuantity}
      />
    </>
  );
};
