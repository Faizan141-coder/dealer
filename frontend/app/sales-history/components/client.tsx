"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Button, LoadingButton } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";

interface PlaceOrderClientProps {
  data: any[]; // Data structure from the backend
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
          title="Dealer Dashboard"
          description={`Total (${data.length})`}
        />
        <div className="flex items-center gap-x-2">
          <Link href="/admin-dashboard">
            <LoadingButton loading={loading}>Go Back</LoadingButton>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <Separator />
    </>
  );
};
