"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, PlaceOrderColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PlaceOrderClientProps {
  data: PlaceOrderColumn[];
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Truck Dashboard"
          description={`Total (${data.length})`}
        />
        <Button onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="product_name" columns={columns} data={data} />
    </>
  );
};
