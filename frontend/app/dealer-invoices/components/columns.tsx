"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { SupplierInvoiceModal } from "@/components/modals/supplier-invoice-modal";
import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";

export type PlaceOrderColumn = {
  access_code: string;
  status: string;
  pickup_address: string;
  supplier_username: string;
  ProductDetail: {
    sub_products: {
      product_name: string;
      product_type: string;
      quantity: number;
      delivery_date: string;
      pickup_date: string;
    }[];
  };
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "access_code",
    header: "Access Code",
  },
  {
    accessorKey: "pickup_address",
    header: "Pickup Address",
  },
  {
    accessorKey: "sub_products",
    header: "Sub Products",
    cell: ({ row }) => {
      const subProducts = row.original.ProductDetail.sub_products;

      return (
        <div>
          {subProducts.map((subProduct, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <p>
                <strong>Product Name:</strong> {subProduct.product_name}
              </p>
              <p>
                <strong>Product Type:</strong> {subProduct.product_type}
              </p>
              <p>
                <strong>Quantity:</strong> {subProduct.quantity}
              </p>
              <p>
                <strong>Delivery Date:</strong> {subProduct.delivery_date}
              </p>
              <p>
                <strong>Pickup Date:</strong> {subProduct.pickup_date}
              </p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Invoice Status",
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
    accessorKey: "supplier_username",
    header: "Supplier Username",
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => {
      const [addModalOpen, setAddModalOpen] = useState(false);
      const [loading, setLoading] = useState(false);
      const token = Cookies.get("authToken");
      const [invoiceData, setInvoiceData] = useState({});

      const status = row.getValue("status") as string;
      console.log("Status:", status);

      const handleOpenModal = () => {
        console.log("Modal opening...");
        setAddModalOpen(true);
      };

      const handleConfirm = async (dates: Record<string, Date>, address: string) => {
        setLoading(true);

        // Transform dates object into the desired format
        const pickupDates = Object.keys(dates).map((key, index) => ({
          sub_product_id: parseInt(key, 10), // Convert the key to an integer if needed
          pickup_date: dates[key].toISOString(), // Format the date to ISO string
        }));

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/create-invoice/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                invoice_id: row.original.id,
                pickup_dates: pickupDates,
                pickup_address: address,
              }),
            }
          );

          if (!row.original.id) {
            throw new Error("Product ID is required");
          }

          const data = await response.json();
          console.log("Full Response Data:", data);
          console.log("Invoice Data:", data.invoice);

          if (data.invoice) {
            setInvoiceData(data.invoice);
          } else {
            console.error("Invoice data is missing from the response");
          }

          if (response.status === 201 || response.status === 200) {
            toast.success("Invoice generated successfully");
            console.log("Invoice generated successfully");
          }
        } catch (error: any) {
          toast.error("Failed to generate invoice");
          console.error("Error generating invoice:", error.message);
        } finally {
          setLoading(false);
        }

        setAddModalOpen(false);

      };

      // console.log("Invoice Data:", invoiceData);

      return (
        <>
          <Button onClick={handleOpenModal}>
            Forward Invoice
          </Button>
          <TruckInvoiceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onConfirm={handleConfirm}
            loading={loading}
            invoiceData={invoiceData}
            productId={row.original.id}
            subProductIds={row.original.ProductDetail.sub_products.map(
              (subProduct) => subProduct.id
            )}
          />
        </>
      );
    },
  },
];
