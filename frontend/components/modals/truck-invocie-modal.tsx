"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SingleCombobox } from "../ui/combo";
import Cookies from "js-cookie";
import { TruckInvoiceDetailModal } from "./truck-invoice-detail-modal";

interface TruckInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  invoiceData: any;
  productId: string;
  // supplierUsername: string;
  setSupplierUsername: React.Dispatch<React.SetStateAction<string>>;
  subProductIds: string[];
}

export const TruckInvoiceModal: React.FC<TruckInvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productId,
  invoiceData,
  // supplierUsername,
  setSupplierUsername,
  subProductIds,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [dealers, setDealers] = useState<string[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [InvoiceDetailModalOpen, setInvoiceDetailModalOpen] =
    useState<boolean>(false);
  const token = Cookies.get("authToken");

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      getTruckCompanies(); // Fetch truck companies when modal is opened
    }
  }, [isOpen]);

  const getTruckCompanies = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/get-all-truck-companies/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setDealers(data.truck_companies); // Update state with fetched dealers
        setSupplierUsername(data.truck_companies); // Set initial dealer
        setSelectedDealer(data.truck_companies[0] || null); // Set initial dealer
      } else {
        setError("Failed to fetch truck companies.");
      }
    } catch (err) {
      setError("An error occurred while fetching truck companies.");
    }
  };

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    if (!selectedDealer) {
      setError("Please select a truck company.");
      return;
    }

    const requestData = {
      product_id: productId,
      truck_company_username: selectedDealer,
      sub_product_ids: subProductIds,
    };

    console.log("Request Data:", requestData);

    onConfirm(requestData);
    // setInvoiceDetailModalOpen(true);
  };

  return (
    <>
      <Modal
        title="Forward Invoice"
        description="Please fill in the details below to forward the invoice."
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
                itemText="Truck Company"
                nothingFoundText="No Truck Companies Found."
                customWidth="w-full"
                defaultValue={dealers[0]}
                setCurrentItem={(value) => {
                  // setSelectedDealer(value);
                  // if (setSupplierUsername) setSupplierUsername(value);
                  setSelectedDealer(value as string);
                  if (setSupplierUsername) setSupplierUsername(value as string);
                }}
              />
            </div>
          </div>
          <Button
            disabled={loading}
            className="bg-green-500 focus:ring-green-500 hover:bg-green-400 text-white space-x-3"
            type="submit"
            onClick={handleConfirm}
          >
            <span>Forward Invoice</span>
            <SendHorizontal color="#fff" className="h-4 w-4" />
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Modal>
      <TruckInvoiceDetailModal
        isOpen={InvoiceDetailModalOpen}
        onClose={() => setInvoiceDetailModalOpen(false)}
        loading={loading}
        onConfirm={onConfirm}
        invoiceData={invoiceData}
        product_reference_id={productId}
        id={invoiceData.id}
        supplier_username={selectedDealer || ""}
      />
    </>
  );
};
