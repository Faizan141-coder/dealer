"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SingleCombobox } from "../ui/combo";
import Cookies from "js-cookie";
import { Input } from "../ui/input";

interface DriverInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  invoiceData: any;
  driverFullName: string;
  truckPlateNumber: string;
  driverPhoneNumber: string;
  driverAddress: string;
  driverEmail: string;
  setSupplierUsername?: React.Dispatch<React.SetStateAction<string>>;
  setDriverFullName: React.Dispatch<React.SetStateAction<string>>;
  setTruckPlateNumber: React.Dispatch<React.SetStateAction<string>>;
  setDriverPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setDriverAddress: React.Dispatch<React.SetStateAction<string>>;
  setDriverEmail: React.Dispatch<React.SetStateAction<string>>;
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
  driverFullName,
  truckPlateNumber,
  driverPhoneNumber,
  driverAddress,
  driverEmail,
  setSupplierUsername,
  setDriverFullName,
  setTruckPlateNumber,
  setDriverPhoneNumber,
  setDriverAddress,
  setDriverEmail,
  subProductId,
  supplierInvoiceId,
  dealerInvoiceId,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [dealers, setDealers] = useState<string[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("authToken");

  

  useEffect(() => {
    setIsMounted(true);
    // if (isOpen) {
    //   getTruckCompanies(); // Fetch truck companies when modal is opened
    // }
  }, [isOpen]);

  // const getTruckCompanies = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/get-all-drivers/", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.status === 200) {
  //       const data = await response.json();
  //       setDealers(data.drivers); // Update state with fetched dealers
  //       setSupplierUsername(data.drivers); // Set initial dealer
  //       setSelectedDealer(data.drivers); // Set initial dealer
  //     } else {
  //       setError("Failed to fetch truck companies.");
  //     }
  //   } catch (err) {
  //     setError("An error occurred while fetching truck companies.");
  //   }
  // };

  if (!isMounted) {
    return null;
  }

  console.log("Full Name: ", driverFullName);
  console.log("Truck Plate Number: ", truckPlateNumber);
  console.log("Driver Phone Number: ", driverPhoneNumber);
  console.log("Driver Address: ", driverAddress);
  console.log("Driver Email: ", driverEmail);

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
            <div>
              <div>
                <Input
                  placeholder="Driver Full Name"
                  type="text"
                  value={driverFullName}
                  onChange={(e) => setDriverFullName(e.target.value)}
                />
                <div className="mt-5 flex space-x-5">
                  <Input
                    placeholder="Truck Plate Number"
                    type="text"
                    value={truckPlateNumber}
                    onChange={(e) => setTruckPlateNumber(e.target.value)}
                  />
                  <Input
                    placeholder="Driver Phone Number"
                    type="text"
                    value={driverPhoneNumber}
                    onChange={(e) => setDriverPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="mt-5 flex space-x-5">
                  <Input
                    placeholder="Driver Address"
                    type="text"
                    value={driverAddress}
                    onChange={(e) => setDriverAddress(e.target.value)}
                  />
                  <Input
                    placeholder="Driver Email"
                    type="text"
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            disabled={loading}
            className="bg-green-500 focus:ring-green-500 hover:bg-green-400 text-white space-x-3"
            type="submit"
            onClick={onConfirm}
          >
            <span>Forward Invoice</span>
            <SendHorizontal color="#fff" className="h-4 w-4" />
          </Button>
        </div>
        {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
      </Modal>
    </>
  );
};
