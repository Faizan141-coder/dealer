import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export type PlaceOrderColumn = {
  id: string;
  status: string;
  user_details: {
    username: string;
  };
  sub_products: {
    id: string;
    product_name: string;
    product_type: string;
    sub_status: string;
    quantity: string;
  }[];
  delivery_date: string;
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
          <Button
            onClick={() => handleOpenModal(subProduct.id)}
            disabled={subProduct.sub_status !== "Pending with dealer"}
            className="mt-5"
          >
            Invoice {subProduct.id}
          </Button>
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
    accessorKey: "invoice",
    header: "Invoice",
    cell: InvoiceCell, // Use the component here
  },
];

