import { ColumnDef } from "@tanstack/react-table";
import { Button, LoadingButton } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type PlaceOrderColumn = {
  id: string;
  // status: string;
  user_details: {
    username: string;
    phone: string;
    sales_representative: string;
  };
  sub_orders: {
    id: string;
    delivery_date: string;
    product_name: string;
    product_type: string;
    sub_status: string;
    quantity: string;
    truck_company_phone: string;
    driver_phone_number: string;
  }[];
};

const InvoiceCell = ({ row }: { row: any }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supplierUsername, setSupplierUsername] = useState("");
  const token = Cookies.get("authToken");
  const [invoiceData, setInvoiceData] = useState<any>({});
  const [subOrderId, setSubOrderId] = useState<string>("");

  const router = useRouter();

  // const status = row.getValue("status") as string;
  const subOrders = row.original.sub_orders;

  const handleOpenModal = (subOrderId: string) => {
    setSubOrderId(subOrderId);
    setAddModalOpen(true);
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
            truck_company_username: supplierUsername,
            sub_order_ids: [subOrderId],
          }),
        }
      );

      console.log(response);

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
      toast({
        variant: "destructive",
        description: error.message,
      });
      console.error("Error generating invoice:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {subOrders.map((subOrder: any, index: any) => (
        <div key={subOrder.id}>
          <LoadingButton
            loading={loading}
            onClick={() => handleOpenModal(subOrder.id)}
            disabled={subOrder.sub_status !== "Pending with Admin"}
            className="my-5"
          >
            Forward Order
          </LoadingButton>
          <TruckInvoiceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onConfirm={() => handleConfirm([subOrder.id])}
            loading={loading}
            invoiceData={invoiceData}
            productId={row.original.id}
            setSupplierUsername={setSupplierUsername}
            subProductIds={[subOrder.id || ""]}
          />
        </div>
      ))}
    </div>
  );
};

const ActionCell = ({ row }: { row: any }) => {
  const order = row.original;
  const token = Cookies.get("authToken");

  const handleDownloadInvoice = async (subOrderId: string) => {
    const response = await fetch(`http://127.0.0.1:8000/generate-pdf/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: row.original.id,
        sub_order_id: subOrderId,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } else {
      console.error("Failed to download invoice");
      toast({
        variant: "destructive",
        description: "Failed to download invoice",
      });
    }
  };

  const openWhatsAppChat = (phoneNumber: string | null) => {
    if (phoneNumber && phoneNumber !== "NOT PROVIDED") {
      window.open(`https://wa.me/${phoneNumber.replace(/\D/g, "")}`, "_blank");
    } else {
      toast({
        variant: "destructive",
        description:
          "Either the relevant party has not provided their phone number or the order is not yet ready to be forwarded to them.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {order.sub_orders.map((subOrder: any, index: number) => (
        <DropdownMenu key={subOrder.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 my-5">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions for {subOrder.id}</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleDownloadInvoice(subOrder.id)}
            >
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => openWhatsAppChat(order.user_details.phone)}
            >
              Chat with Client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openWhatsAppChat(subOrder.driver_phone_number)}
            >
              Chat with Driver
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openWhatsAppChat(subOrder.truck_company_phone)}
            >
              Chat with Truck Company
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
    header: "Order ID",
  },
  {
    accessorKey: "sub_orders",
    header: "Sub Orders",
    cell: ({ row }) => {
      const subOrders = row.original.sub_orders;

      return (
        <div>
          {subOrders.map((subOrder, index) => (
            <div key={subOrder.id} className="mb-2 p-2 border rounded">
              <p>
                <strong>ID:</strong> {subOrder.id}
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
                <strong>Delivery Date: </strong> {subOrder.delivery_date}
              </p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "user_details.username",
    header: "Client Username",
  },
  {
    accessorKey: "user_details.phone",
    header: "Client Phone",
  },
  {
    accessorKey: "user_details.sales_representative",
    header: "Sales Representative",
  },
  {
    accessorKey: "sub_orders.sub_status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="hover:bg-slate-100 transition duration-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const subOrders = row.original.sub_orders;   

      return (
        <div>
          {subOrders.map((subOrder, index) => (
            <div key={subOrder.id} className="flex flex-row my-14">
              <Badge
                className={cn(
                  "mr-2",
                  subOrder.sub_status.toLowerCase().includes("pending") &&
                    "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-300 hover:text-yellow-900",
                  subOrder.sub_status.toLowerCase().includes("cancelled") &&
                    "bg-red-100 text-red-800 border-red-300 hover:bg-red-300 hover:text-red-900",
                  subOrder.sub_status.toLowerCase().includes("confirmed") &&
                    "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-300 hover:text-blue-900",
                  subOrder.sub_status.toLowerCase().includes("delivered") &&
                    "bg-green-100 text-green-800 border-green-300 hover:bg-green-300 hover:text-green-900",
                  subOrder.sub_status.toLowerCase().includes("assigned") &&
                    "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-300 hover:text-purple-900",
                  subOrder.sub_status.toLowerCase().includes("picked") &&
                    "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-300 hover:text-orange-900"
                )}
              >
                {subOrder.sub_status}
              </Badge>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ActionCell,
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: InvoiceCell,
  },
];
