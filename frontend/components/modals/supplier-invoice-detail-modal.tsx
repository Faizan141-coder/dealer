"use client";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SupplierInvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  invoiceData: any;
  product_reference_id: string;
  id: string;
}

export const SupplierInvoiceDetailModal: React.FC<SupplierInvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  invoiceData,
  product_reference_id,
  id,
}) => {
  const token = Cookies.get("authToken");
  const router = useRouter();

  const handleConfirm = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/confirm-order/`,
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
        toast.success("Order Confirmed");
        console.log("Invoice generated successfully");
      }

      console.log("Invoice Data1 :", invoiceData);
    } catch (error: any) {
      console.error("supplier id not provided", error.message);
    } finally {
      onClose();
    }
  };

  const currentInvoiceData = invoiceData

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
          <Input value={currentInvoiceData?.access_code ?? ''} disabled />
        </div>
        <div>
          <Label>Client Name</Label>
          <Input value={currentInvoiceData?.client_name ?? ''} disabled />
        </div>
        <div>
          <Label>Pickup Address</Label>
          <Input value={currentInvoiceData?.pickup_address ?? ''} disabled />
        </div>
        <div>
          <Label>Quantity</Label>
          <Input value={currentInvoiceData?.product_quantity ?? ''} disabled />
        </div>
        <div>
          <Label>Price</Label>
          <Input value={currentInvoiceData?.price ?? ''} disabled />
        </div>
        <div>
          <Label>Client Name</Label>
          <Input value={currentInvoiceData?.client_name ?? ''} disabled />
        </div>
        <div>
          <Label>Client Address</Label>
          <Input value={currentInvoiceData?.client_address ?? ''} disabled />
        </div>
        <div>
          <Label>Client Phone</Label>
          <Input value={currentInvoiceData?.client_phone ?? ''} disabled />
        </div>
      </div>
      <div className="flex justify-end mt-8 space-x-3">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={loading}>
          Confirm Order
        </Button>
      </div>
    </Modal>
  );
};
