"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button, LoadingButton } from "@/components/ui/button";
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
  // driverAddress: string;
  driverEmail: string;
  setSupplierUsername?: React.Dispatch<React.SetStateAction<string>>;
  setDriverFullName: React.Dispatch<React.SetStateAction<string>>;
  setTruckPlateNumber: React.Dispatch<React.SetStateAction<string>>;
  setDriverPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  // setDriverAddress: React.Dispatch<React.SetStateAction<string>>;
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
  // driverAddress,
  driverEmail,
  setSupplierUsername,
  setDriverFullName,
  setTruckPlateNumber,
  setDriverPhoneNumber,
  // setDriverAddress,
  setDriverEmail,
  subProductId,
  supplierInvoiceId,
  dealerInvoiceId,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isOpen]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Modal
        title="Assign to Driver"
        description="Please fill in the driver details below to assign the order to the driver. Write NA if the information is not available."
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
                    placeholder="Driver Email"
                    type="text"
                    value={driverEmail}
                    onChange={(e) => setDriverEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <LoadingButton
            loading={loading}
            className="bg-green-500 focus:ring-green-500 hover:bg-green-400 text-white space-x-3"
            type="submit"
            onClick={onConfirm}
          >
            <span>Assign to Driver</span>
            <SendHorizontal color="#fff" className="h-4 w-4" />
          </LoadingButton>
        </div>
      </Modal>
    </>
  );
};
