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

interface SupplierInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  invoiceData: any;
  productId: string;
}

export const SupplierInvoiceModal: React.FC<SupplierInvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productId,
  invoiceData,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] =
    useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const token = Cookies.get("authToken");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    console.log("Invoice Data:", invoiceData);
    console.log("Product ID:", productId);
    console.log("Date:", date.toString());

    // Call the onConfirm function to handle any additional logic needed, such as API calls.
    onConfirm({
      product_id: productId,
      date: date,
      // invoiceData: invoiceData,
    });

    // Open the detail modal after confirming the action.
    setInvoiceDetailModalOpen(true);
  };

  return (
    <>
      <Modal
        title="Generate Invoice"
        description="Please fill in the details below to generate an invoice."
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="flex flex-col items-center justify-center space-y-5">
          <div className="w-full">
            <div className="mt-5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => setDate(day as Date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

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

      {/* Render the SupplierInvoiceDetailModal */}
      {invoiceDetailModalOpen && (
        <SupplierInvoiceDetailModal
          isOpen={invoiceDetailModalOpen}
          onClose={() => setInvoiceDetailModalOpen(false)}
          invoiceData={invoiceData} // Pass the invoice data to the detail modal
          product_reference_id={productId}
          id={invoiceData.id}
          loading={loading}
        />
      )}
    </>
  );
};