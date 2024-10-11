"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import { ConfirmPickupModal } from "@/components/modals/confirm-pickup-modal";

export type PlaceOrderColumn = {
  id: string;
  access_code: string;
  pickup_address: string;
  pickup_date: string;
  product_name: string;
  product_type: string;
  quantity: string;
  delivery_date: string;
  delivery_address: string;
  client_name: string;
  client_phone_number: string;
  supplier_name: string;
  supplier_phone: string;
  dealer_name: string;
  dealer_phone: string;
  supplier_invoice_id: string;
  dealer_invoice_id: string;
  sub_product_id: string;
};

const InvoiceButton = ({ row }: { row: any }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [weight, setWeight] = useState<number>(0); // State to handle weight input
  const token = Cookies.get("authToken");

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  const handleConfirm = async (weight: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/pickup-from-facility/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sub_product_id: row.original.sub_product_id,
            actual_weight: weight,
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);
      setInvoiceData(data);
    } catch (error: any) {
      console.error("Error generating invoice:", error.message);
    } finally {
      setLoading(false);
      setAddModalOpen(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpenModal} className="whitespace-nowrap">
        Confirm Pickup
      </Button>
      <ConfirmPickupModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
        weights={setWeight}
      />
    </>
  );
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "pickup_address",
    header: "Pickup Address",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("pickup_address")}
      </div>
    ),
  },
  {
    accessorKey: "pickup_date",
    header: "Pickup Date",
  },
  {
    accessorKey: "access_code",
    header: "Access Code",
  },
  {
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("product_name")}
      </div>
    ),
  },
  {
    accessorKey: "product_type",
    header: "Product Type",
    cell: ({ row }) => {
      const type = row.getValue("product_type") as string;
      return (
        <Badge
          className={cn(
            "whitespace-nowrap",
            type === "type_1"
              ? "bg-blue-500 text-white"
              : "bg-pink-500 text-white"
          )}
        >
          {type === "type_1" ? "Type 1" : "Type 2"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
  },
  {
    accessorKey: "delivery_address",
    header: "Delivery Address",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("delivery_address")}
      </div>
    ),
  },
  {
    accessorKey: "client_name",
    header: "Client Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("client_name")}
      </div>
    ),
  },
  {
    accessorKey: "client_phone_number",
    header: "Client Phone",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("client_phone_number")}
      </div>
    ),
  },
  {
    accessorKey: "supplier_name",
    header: "Supplier Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("supplier_name")}
      </div>
    ),
  },
  {
    accessorKey: "supplier_phone",
    header: "Supplier Phone",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue("supplier_phone")}</div>
    ),
  },
  {
    accessorKey: "dealer_name",
    header: "Dealer Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("dealer_name")}
      </div>
    ),
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => <InvoiceButton row={row} />, // Use the new component
  },
];

export default function Component() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead></thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="p-2 text-center">
              Table data would be rendered here
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
