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
  status: string;
  user_details: {
    username: string;
    phone: string;
    sales_representative: string;
  };
  sub_products: {
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
  const [subProductId, setSubProductId] = useState<string>("");

  const router = useRouter();

  const status = row.getValue("status") as string;
  const subProducts = row.original.sub_products;

  const handleOpenModal = (subProductId: string) => {
    setSubProductId(subProductId);
    setAddModalOpen(true);
  };

  const handleConfirm = async (subProductIds: string[]) => {
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
            // invoice_id: row.original.id,
            sub_product_ids: [subProductId],
          }),
        }
      );

      console.log(response);

      if (!row.original.id) {
        throw new Error("Product ID is required");
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
      {subProducts.map((subProduct: any, index: any) => (
        <div key={subProduct.id}>
          <LoadingButton
            loading={loading}
            onClick={() => handleOpenModal(subProduct.id)}
            disabled={subProduct.sub_status !== "Pending with Admin"}
            className="my-5"
          >
            Invoice {subProduct.id}
          </LoadingButton>
          <TruckInvoiceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onConfirm={() => handleConfirm([subProduct.id])}
            loading={loading}
            invoiceData={invoiceData}
            productId={row.original.id}
            setSupplierUsername={setSupplierUsername}
            subProductIds={[subProduct.id || ""]}
          />
        </div>
      ))}
    </div>
  );
};

const ActionCell = ({ row }: { row: any }) => {
  const order = row.original;
  const token = Cookies.get("authToken");

  const handleDownloadInvoice = async (subProductId: string) => {
    const response = await fetch(`http://127.0.0.1:8000/generate-pdf/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: row.original.id,
        sub_product_id: subProductId,
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
    }
  };

  const openWhatsAppChat = (phoneNumber: string | null) => {
    if (phoneNumber && phoneNumber !== "NOT PROVIDED") {
      window.open(
        `https://wa.me/${phoneNumber.replace(/\D/g, "")}`,
        "_blank"
      );
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
      {order.sub_products.map((subProduct: any, index: number) => (
        <DropdownMenu key={subProduct.id}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 my-2">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions for {subProduct.id}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleDownloadInvoice(subProduct.id)}>
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => openWhatsAppChat(order.user_details.phone)}
            >
              Chat with Client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openWhatsAppChat(subProduct.driver_phone_number)}
            >
              Chat with Driver
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openWhatsAppChat(subProduct.truck_company_phone)}
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
    accessorKey: "sub_products",
    header: "Sub Products",
    cell: ({ row }) => {
      const subProducts = row.original.sub_products;

      return (
        <div>
          {subProducts.map((subProduct, index) => (
            <div key={subProduct.id} className="mb-2 p-2 border rounded">
              <p>
                <strong>ID:</strong> {subProduct.id}
              </p>
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
                <strong>Status:</strong> {subProduct.sub_status}
              </p>
              <p>
                <strong>Delivery Date: </strong> {subProduct.delivery_date}
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
    accessorKey: "status",
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
    id: "actions",
    enableHiding: false,
    cell: ActionCell, // Use the new ActionCell component here
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: InvoiceCell, // Use the component here
  },
];
