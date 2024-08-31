"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { InvoiceModal } from "@/components/modals/invoice-modal";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export type PlaceOrderColumn = {
  id: string;
  product_name: string;
  product_type: string;
  quantity: string;
  status: string;
  user_details: {
    username: string;
  };
  delivery_date: string;
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-slate-100 transition duration-100"
        >
          Product Name
        </Button>
      );
    },
  },
  {
    accessorKey: "user_details.username",
    header: "Client Username",
  },
  {
    accessorKey: "product_type",
    header: "Product Type",
    cell: ({ row }) => {
      const type = row.getValue("product_type") as string;

      return (
        <Badge
          className={cn(
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
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-slate-100 transition duration-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          className={cn(
            status.toLowerCase().includes("pending")
              ? "bg-yellow-500 text-white"
              : status.toLowerCase().includes("cancelled")
              ? "bg-red-500 text-white"
              : status.toLowerCase().includes("confirmed")
              ? "bg-blue-500 text-white"
              : status.toLowerCase().includes("delivered")
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => {
      const [addModalOpen, setAddModalOpen] = useState(false);
      const [loading, setLoading] = useState(false);
      const [supplierUsername, setSupplierUsername] = useState("");
      const token = Cookies.get("authToken");
      const [invoiceData, setInvoiceData] = useState({});

      const status = row.getValue("status") as string;

      const handleOpenModal = () => {
        setAddModalOpen(true);
      };

      const handleConfirm = async () => {
        setLoading(true);

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/generate-invoice/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                supplier_username: supplierUsername,
                product_id: row.original.id,
              }),
            }
          );

          if (!supplierUsername) {
            throw new Error("Supplier username is required");
          }

          if (!row.original.id) {
            throw new Error("Product ID is required");
          }

          const data = await response.json();
          console.log(data.invoice);
          setInvoiceData(data.invoice);

          if (response.status === 201) {
            toast.success("Invoice generated successfully");
            console.log("Invoice generated successfully");
          }
        } catch (error: any) {
          toast.error("Failed to generate invoice");
          console.error("supplier id not provided", error.message);
        } finally {
          setLoading(false);
        }

        setLoading(false);
        setAddModalOpen(false);
      };

      console.log("Invoice Data:", invoiceData);

      return (
        <>
          <Button
            onClick={handleOpenModal}
            disabled={status !== "Pending with Dealer"}
          >
            Invoice
          </Button>
          <InvoiceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onConfirm={handleConfirm}
            loading={loading}
            invoiceData={invoiceData}
            productId={row.original.id}
            supplierUsername={supplierUsername} // Pass the state
            setSupplierUsername={setSupplierUsername} // Pass the state setter
          />
        </>
      );
    },
  },
];
