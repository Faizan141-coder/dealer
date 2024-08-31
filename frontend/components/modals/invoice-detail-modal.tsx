"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  invoiceData: any;
  product_reference_id: string;
  id: string;
  supplier_username: string;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  invoiceData,
  product_reference_id,
  supplier_username,
  id,
}) => {
  const token = Cookies.get("authToken");
  const router = useRouter();

  const handleConfirm = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/assign-order-to-supplier/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id: product_reference_id,
            invoice_id: id,
            supplier_username: supplier_username,
          }),
        }
      );

      const data = await response.json();
      //   console.log(data.invoice);
      router.refresh();

      if (response.status === 201) {
        console.log("Invoice generated successfully");
      }
    } catch (error: any) {
      console.error("supplier id not provided", error.message);
    } finally {
    }
  };

  return (
    <Modal
      title="Invoice Details"
      description="View the details of the invoice"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input value={invoiceData.product_name} disabled />
        </div>
        <div>
          <Label>Type</Label>
          <Input value={invoiceData.product_type} disabled />
        </div>
        <div>
          <Label>Quantity</Label>
          <Input value={invoiceData.product_quantity} disabled />
        </div>
        <div>
          <Label>Assigned To</Label>
          <Input value={invoiceData.assigned_to} disabled />
        </div>
        <div>
          <Label>Client Name</Label>
          <Input value={invoiceData.client_name} disabled />
        </div>
        <div>
          <Label>Client Address</Label>
          <Input value={invoiceData.client_address} disabled />
        </div>
        <div>
          <Label>Client City</Label>
          <Input value={invoiceData.client_city} disabled />
        </div>
        <div>
          <Label>Client State</Label>
          <Input value={invoiceData.client_state} disabled />
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
