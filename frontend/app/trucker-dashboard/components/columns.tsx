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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

// New component to handle invoice generation
const InvoiceButton = ({ row }: { row: any }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const token = Cookies.get("authToken");
  const [truckPlateNumber, setTruckPlateNumber] = useState<string>("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState<string>("");
  const [driverAddress, setDriverAddress] = useState<string>("");
  const [driverEmail, setDriverEmail] = useState<string>("");
  const [driverFullName, setDriverFullName] = useState<string>("");

  const router = useRouter();

  const status = row.getValue("status") as string;
  const dealerPhoneNumber = row.original.dealer_phone;

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${dealerPhoneNumber}`, "_blank");
  };

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/assign-to-driver/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          driver_username: driverFullName,
          truck_plate_number: truckPlateNumber,
          driver_phone_number: driverPhoneNumber,
          driver_address: driverAddress,
          driver_email: driverEmail,
          sub_product_id: row.original.sub_product_id,
          dealer_invoice_id: row.original.dealer_invoice_id,
        }),
      });

      const data = await response.json();
      router.refresh();
      console.log(data);
    } catch (error: any) {
      console.error("Error generating invoice:", error.message);
    } finally {
      setLoading(false);
      setAddModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleOpenModal}
          className="whitespace-nowrap"
          disabled={status !== "Pending with Truck Company"}
        >
          Generate Invoice
        </Button>
      </div>
      <DriverInvoiceModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => handleConfirm()}
        loading={loading}
        invoiceData={invoiceData}
        setDriverFullName={setDriverFullName}
        setTruckPlateNumber={setTruckPlateNumber}
        setDriverPhoneNumber={setDriverPhoneNumber}
        setDriverAddress={setDriverAddress}
        setDriverEmail={setDriverEmail}
        driverFullName={driverFullName}
        truckPlateNumber={truckPlateNumber}
        driverPhoneNumber={driverPhoneNumber}
        driverAddress={driverAddress}
        driverEmail={driverEmail}
        subProductId={row.original.sub_product_id}
        supplierInvoiceId={row.original.supplier_invoice_id}
        dealerInvoiceId={row.original.dealer_invoice_id}
      />
    </>
  );
};

const ActionButton = ({ row }: { row: any }) => {
  {
    const order = row.original;
    const token = Cookies.get("authToken");
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isBolNumberModalOpen, setIsBolNumberModalOpen] = useState(false);
    const [miles, setMiles] = useState("");
    const [bolNumber, setBolNumber] = useState("");

    const isDelivered = order.status === "Delivered";
    const isPickedUp = order.status === "Picked up from Facility";

    const handleQuoteMiles = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/quote-miles-traveled/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sub_product_id: order.sub_product_id,
              miles_traveled: miles,
            }),
          }
        );
        // Handle response as needed
        setIsQuoteModalOpen(false);
        setMiles("");
        toast({
          description: "Miles quoted successfully",
        });
      } catch (error: any) {
        console.error("Error quoting miles:", error.message);
        toast({
          variant: "destructive",
          description: "Failed to quote miles",
        });
      }
    };

    // similar to handle Quote Miles add function to handle Add Bol Number

    const handleAddBolNumber = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/link-bol-number/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sub_product_id: order.sub_product_id,
              bol: bolNumber,
            }),
          }
        );

        console.log(bolNumber)

        // Handle response as needed
        setIsBolNumberModalOpen(false);
        setBolNumber("");
        toast({
          description: "BOL number added successfully",
        });
      } catch (error: any) {
        console.error("Error adding BOL number:", error.message);
        toast({
          variant: "destructive",
          description: "Failed to add BOL number",
        });
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
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setIsQuoteModalOpen(true)}
              disabled={!isDelivered}
            >
              Quote Miles
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsBolNumberModalOpen(true)}
              disabled={isDelivered || isPickedUp}
            >
              Add Bol Number
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => openWhatsAppChat(order.dealer_phone)}
            >
              Chat with Dealer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quote Miles</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="number"
                placeholder="Enter miles"
                value={miles}
                onChange={(e) => setMiles(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsQuoteModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleQuoteMiles}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isBolNumberModalOpen}
          onOpenChange={setIsBolNumberModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add BOL Number</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter BOL number"
                value={bolNumber}
                onChange={(e) => setBolNumber(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsBolNumberModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleAddBolNumber}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

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
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => <InvoiceButton row={row} />, // Use the new component
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionButton row={row} />,
  }
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
