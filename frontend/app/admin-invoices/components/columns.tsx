"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button, LoadingButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";
import { toast } from "@/components/ui/use-toast";
import { error } from "console";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export type PlaceOrderColumn = {
  id: string;
  access_code: string;
  status: string;
  pickup_address: string;
  supplier_username: string;
  OrderDetail: {
    sub_orders: {
      id: string;
      product_name: string;
      product_type: string;
      quantity: number;
      delivery_date: string;
      pickup_date: string;
      sub_status: string;
      actual_quantity: string;
    }[];
  };
};

const SubOrdersCell = ({ row }: { row: any }) => {
  const subOrders = row.original.OrderDetail.sub_orders;
  const [modalStates, setModalStates] = useState<boolean[]>(
    Array(subOrders.length).fill(false)
  );
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [truckCompanyUsername, setTruckCompanyUsername] = useState("");

  const token = Cookies.get("authToken");
  const router = useRouter();

  const handleOpenModal = (index: number) => {
    const newModalStates = [...modalStates];
    newModalStates[index] = true;
    setModalStates(newModalStates);
  };

  const handleCloseModal = (index: number) => {
    const newModalStates = [...modalStates];
    newModalStates[index] = false;
    setModalStates(newModalStates);
  };

  const handleConfirm = async (subOrderIds: string[]) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/forward-invoice-to-truck-company/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            truck_company_username: truckCompanyUsername,
            invoice_id: row.original.id,
            sub_order_ids: subOrderIds,
          }),
        }
      );

      if (!row.original.id) {
        throw new Error("Order ID is required");
      }

      const data = await response.json();

      if (response.status === 200) {
        toast({
          variant: "default",
          description: data.message,
        });
      }
      router.refresh();
    } catch (error: any) {
      console.error("Error generating invoice:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmStatus = async (subOrderId: string) => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/delivery-confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sub_order_id: subOrderId,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast({
          variant: "default",
          description: "Delivery confirmed successfully",
        });
      }
      router.refresh();
    } catch {
      console.error("Error confirming status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {subOrders.map((subOrder: any, index: any) => (
        <div
          key={subOrder.id}
          className="mb-2 p-2 border rounded flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Order Id: </strong> {subOrder.id}
            </p>
            <p>
              <strong>Product Name:</strong> {subOrder.product_name}
            </p>
            <p>
              <strong>Product Type:</strong> {subOrder.product_type}
            </p>
            <p>
              <strong>Quantity:</strong> {subOrder.quantity}
            </p>
            <p>
              <strong>Actual Load</strong> {subOrder.actual_quantity}
            </p>
            <p>
              <strong>Delivery Date:</strong> {subOrder.delivery_date}
            </p>
            <p>
              <strong>Status:</strong> {subOrder.sub_status}
            </p>
          </div>
          <div>
            <LoadingButton
              onClick={() => confirmStatus(subOrder.id)}
              disabled={subOrder.sub_status.toLowerCase() === "delivered"}
            >
              {subOrder.sub_status.toLowerCase() === "delivered"
                ? "Delivered"
                : "Confirm Delivery"}
            </LoadingButton>
          </div>
          <TruckInvoiceModal
            isOpen={modalStates[index]}
            onClose={() => handleCloseModal(index)}
            onConfirm={() => handleConfirm([subOrder.id])}
            loading={loading}
            invoiceData={invoiceData}
            productId={row.original.id}
            setSupplierUsername={setTruckCompanyUsername}
            subProductIds={[subOrder.id]}
          />
        </div>
      ))}
    </div>
  );
};

const ActionCell = ({ row }: { row: any }) => {
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("authToken");

  // const subProductId = row.original.ProductDetail.sub_products[0].id;

  const getSupplierTicket = async (subOrderId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/get-supplier-ticket/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sub_order_id: subOrderId.toString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to retrieve supplier ticket");
      }

      // Get the filename from the 'Content-Disposition' header
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "ticket.pdf"; // Default filename

      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .replace(/"/g, "");
      }

      const blob = await response.blob(); // Fetch the response as a blob (PDF)
      const url = URL.createObjectURL(blob); // Create a URL for the blob

      // Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Use the extracted filename
      document.body.appendChild(link);
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);

      toast({
        variant: "default",
        description: "Supplier ticket retrieved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSupplierInvoice = async (supplierInvoiceId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/get-supplier-invoice/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            supplier_invoice_id: supplierInvoiceId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to retrieve supplier invoice");
      }

      // Get the filename from the 'Content-Disposition' header
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "invoice.pdf"; // Default name in case it's not provided

      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .replace(/"/g, "");
      }

      const blob = await response.blob(); // Fetch the response as a blob (PDF)
      const url = URL.createObjectURL(blob); // Create a URL for the blob

      // Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Use the extracted filename
      document.body.appendChild(link);
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);

      toast({
        variant: "default",
        description: "Supplier invoice retrieved successfully",
      });
    } catch (error: any) {
      console.log("Error fetching supplier invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {row.original.OrderDetail.sub_orders.map((subOrder: any) => (
        <DropdownMenu key={subOrder.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => getSupplierInvoice(row.original.id)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Supplier Invoice"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => getSupplierTicket(subOrder.id)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Supplier Ticket"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "access_code",
    header: "Access Code",
  },
  {
    accessorKey: "pickup_address",
    header: "Pickup Address",
  },
  {
    accessorKey: "sub_orders",
    header: "Sub Orders",
    cell: SubOrdersCell, // Use the extracted component
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
    id: "actions",
    enableHiding: false,
    cell: ActionCell,
  },
];