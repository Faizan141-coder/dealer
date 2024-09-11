"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import { DriverInvoiceModal } from "@/components/modals/driver-invocie-modal";
import { MoreHorizontal, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type PlaceOrderColumn = {
  id: string;
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
  status: string;
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
      <div className="">{row.getValue("delivery_address")}</div>
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
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue("status")}</div>
    ),
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
