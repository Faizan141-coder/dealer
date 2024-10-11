"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button, LoadingButton } from "@/components/ui/button";
import { SingleCombobox } from "../ui/combo";
import Cookies from "js-cookie";
import { InvoiceDetailModal } from "./invoice-detail-modal";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  invoiceData: any;
  productId: string;
  supplierUsername: string;
  setSupplierUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productId,
  invoiceData,
  supplierUsername,
  setSupplierUsername,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [dealers, setDealers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [InvoiceDetailModalOpen, setInvoiceDetailModalOpen] =
    useState<boolean>(false);
  const token = Cookies.get("authToken");

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      getDealers(); // Fetch dealers when modal is opened
    }
  }, [isOpen]);

  const getDealers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/get-all-suppliers/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setDealers(data.suppliers); // Update state with fetched dealers
      } else {
        setError("Failed to fetch dealers.");
      }
    } catch (err) {
      setError("An error occurred while fetching dealers.");
    }
  };

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    const requestData = {
      product_id: productId,
      supplier_username: supplierUsername,
    };

    onConfirm(requestData);
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
              <SingleCombobox
                items={
                  dealers.length > 0
                    ? dealers.map((dealer) => ({
                        value: dealer,
                        label: dealer,
                      }))
                    : []
                }
                itemText="Supplier"
                nothingFoundText="No Suppliers Found."
                customWidth="w-full"
                defaultValue={dealers[0]}
                setCurrentItem={setSupplierUsername}
              />
            </div>
          </div>
          <LoadingButton
            loading={loading}
            className="bg-green-500 focus:ring-green-500 hover:bg-green-400 text-white space-x-3"
            type="submit"
            onClick={handleConfirm}
          >
            <span>Generate Invoice</span>
            <SendHorizontal color="#fff" className="h-4 w-4" />
          </LoadingButton>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Modal>
      <InvoiceDetailModal
        isOpen={InvoiceDetailModalOpen}
        onClose={() => setInvoiceDetailModalOpen(false)}
        loading={loading}
        onConfirm={onConfirm}
        invoiceData={invoiceData}
        product_reference_id={productId}
        id={invoiceData.id}
        supplier_username={supplierUsername}
      />
    </>
  );
};
