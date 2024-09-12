"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PlaceOrderColumn {
  product_name: string;
  quantity: number;
  price_charged_by_truck: number;
  miles_traveled: number;
  delivery_date: string;
  driver_full_name: string;
  driver_phone_number: string;
  truck_plate_number: string;
}

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
          title="Truck Sales Dashboard"
          description={`Total (${data.length})`}
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/trucker-dashboard")}>
            Truck Dashboard
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <Separator />
    </>
  );
};
