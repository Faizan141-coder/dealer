"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, SendHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { SupplierInvoiceDetailModal } from "./supplier-invoice-detail-modal";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface SupplierInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any, address: string) => void;
  loading: boolean;
  invoiceData: any;
  productId: string;
  subProductIds: string[];
}

export const SupplierInvoiceModal: React.FC<SupplierInvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productId,
  invoiceData,
  subProductIds,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] =
    useState<boolean>(false);
  const [dates, setDates] = useState<Record<string, Date>>(
    subProductIds.reduce((acc, id) => {
      acc[id] = new Date(); // Initialize with current date or another default
      return acc;
    }, {} as Record<string, Date>)
  );
  const [address, setAddress] = useState<string>("");
  const token = Cookies.get("authToken");
  let count = 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    console.log("Sub product IDs:", subProductIds);
    console.log("Invoice Data:", invoiceData);
    console.log("Product ID:", productId);
    // Call the onConfirm function to handle any additional logic needed, such as API calls.
    // onConfirm({
    //   product_id: productId,
    //   date: dates,
    //   // invoiceData: invoiceData,
    // });

    onConfirm(dates, address);
    // Open the detail modal after confirming the action.
    setInvoiceDetailModalOpen(true);
  };

  return (
    <>
      <Modal
        title="Generate Invoice"
        description="Please add your pickup time in the same order as the products were shown."
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          {subProductIds.map((id) => (
            <div key={id} className="w-full">
              <div>
                <h1 className="mb-2">Order: {++count}</h1>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dates[id] && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dates[id] ? (
                        format(dates[id], "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dates[id]}
                      onSelect={(day) =>
                        setDates((prev) => ({ ...prev, [id]: day as Date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}

          <div className="w-full mt-4">
            <Label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Delivery Address
            </Label>
            <Input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter the delivery address"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex w-full justify-center">
            <Button
              className="w-1/2"
              disabled={loading}
              onClick={handleConfirm}
            >
              {loading ? "Loading..." : "Generate Invoice"}
            </Button>
          </div>
        </div>
      </Modal>

      {invoiceDetailModalOpen && (
        <SupplierInvoiceDetailModal
          isOpen={invoiceDetailModalOpen}
          onClose={() => setInvoiceDetailModalOpen(false)}
          invoiceData={invoiceData}
          product_reference_id={productId}
          id={invoiceData.id}
          loading={loading}
        />
      )}
    </>
  );
};
