"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, PlaceOrderColumn } from "./columns";
import { AddModal } from "@/components/modals/add-modal";
import { DataTable } from "@/components/ui/data-table";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface PlaceOrderClientProps {
  data: PlaceOrderColumn[];
  username: string;
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({
  data,
  username,
}) => {
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  // const [address, setAddress] = useState("");
  const [dealerUsername, setDealerUsername] = useState("");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
          product_name: productName,
          product_type: productType,
          quantity: quantity,
          delivery_date: deliveryDate,
          // delivery_address: address,
          dealer_username: dealerUsername,
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
    toast({
      title: "Logged out successfully",
      variant: "default",
    });
    router.push("/");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Admin Dashboard"
          description={`Total (${data.length})`}
        />
        <div className="space-x-3">
          {/* add button sales history */}
          <Link href={"/sales-history"}>
            <Button>Sales History</Button>
          </Link>
          <Link href={"/admin-invoices"}>
            <LoadingButton loading={loading}>Show Invoices</LoadingButton>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <Separator />
      <DataTable
        searchKey="status"
        columns={columns}
        data={data}
        username={username}
      />
      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        dealerUsername={dealerUsername}
        setDealerUsername={setDealerUsername}
      />
    </>
  );
};
