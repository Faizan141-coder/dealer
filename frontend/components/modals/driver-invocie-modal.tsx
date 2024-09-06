"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SingleCombobox } from "../ui/combo";
import Cookies from "js-cookie";

interface DriverInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  invoiceData: any;
  setSupplierUsername: React.Dispatch<React.SetStateAction<string>>;
  subProductId: string;
  supplierInvoiceId: string;
  dealerInvoiceId: string;
}

export const DriverInvoiceModal: React.FC<DriverInvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  invoiceData,
  setSupplierUsername,
  subProductId,
  supplierInvoiceId,
  dealerInvoiceId,
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
        "https://dealer-backend-kz82.vercel.app/get-all-drivers/",
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
        setDealers(data.drivers); // Update state with fetched dealers
        setSupplierUsername(data.drivers); // Set initial dealer
        setSelectedDealer(data.drivers); // Set initial dealer
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
      truck_company_username: selectedDealer,
      sub_product_ids: subProductId,
      supplier_invoice_id: supplierInvoiceId,
      dealer_invoice_id: dealerInvoiceId,
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
                itemText="Driver Company"
                nothingFoundText="No Driver Companies Found."
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
    </>
  );
};
