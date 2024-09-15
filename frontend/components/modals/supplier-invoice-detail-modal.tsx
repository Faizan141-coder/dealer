"use client";

import { Button, LoadingButton } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface SupplierInvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  invoiceData: any;
  product_reference_id: string;
  id: string;
}

export const SupplierInvoiceDetailModal: React.FC<
  SupplierInvoiceDetailModalProps
> = ({ isOpen, onClose, loading, invoiceData, product_reference_id, id }) => {
  const token = Cookies.get("authToken");
  const router = useRouter();
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      const response = await fetch(
        "https://dealer-backend-kz82.vercel.app/confirm-order/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product_reference_id,
            invoice_id: id,
          }),
        }
      );

      const data = await response.json();
      router.refresh();

      if (response.status === 200) {
        toast({
          title: "Order Confirmed",
          variant: "default",
        });
        console.log("Invoice confirmed successfully");
      } else {
        toast({
          title: "Failed to confirm the order",
          variant: "destructive",
        });
        console.error(
          "Error confirming order:",
          data.message || response.statusText
        );
      }

      console.log("Invoice Data:", invoiceData);
    } catch (error: any) {
      toast({
        title: "Failed to confirm the order",
        variant: "destructive",
      });
      console.error("Error confirming order:", error.message);
    } finally {
      onClose();
    }
  };

  const currentInvoiceData = invoiceData || {};

  return (
    <Modal
      title="Invoice Details"
      description="View the details of the invoice"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Access Code</Label>
          <Input value={currentInvoiceData.access_code || ""} disabled />
        </div>
        <div>
          <Label>Pickup Address</Label>
          <Input value={currentInvoiceData.pickup_address || ""} disabled />
        </div>
      </div>
      <div className="flex justify-end mt-8 space-x-3">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <LoadingButton onClick={handleConfirm} loading={loading}>
          {loading ? "Loading..." : "Confirm Order"}
        </LoadingButton>
      </div>
    </Modal>
  );
};
