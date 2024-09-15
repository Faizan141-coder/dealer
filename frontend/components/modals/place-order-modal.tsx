"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

import Cookies from "js-cookie";
import { SingleCombobox } from "../ui/combo";

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dealerUsername: string) => void;
  loading: boolean;
  dealerUsername: string;
  setDealerUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  dealerUsername,
  setDealerUsername,
}) => {
  const token = Cookies.get("authToken");
  const [clients, setClients] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      getClients(); // Fetch dealers when modal is opened
    }
  }, [isOpen]);

  const getClients = async () => {
    try {
      const response = await fetch("https://dealer-backend-kz82.vercel.app/get-all-clients/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        if (data.clients) {
          setClients(data.clients);
        } else {
          setError("Failed to fetch dealers.");
        } 
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

  // Check if all required fields are filled
  const isFormValid = () => {
    return true;
  };

  const handleConfirm = () => {
    onConfirm(dealerUsername);
    onClose();
  };

  return (
    <Modal
      title="Place Order"
      description="Please select a client to place an order."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col space-y-4">
        <div className="mt-5">
          <SingleCombobox
            items={
              clients.length > 0
                ? clients.map((client) => ({
                    value: client,
                    label: client,
                  }))
                : []
            }
            itemText="Client"
            nothingFoundText="No Clients Found."
            customWidth="w-full"
            defaultValue={clients[0]}
            setCurrentItem={setDealerUsername}
          />
        </div>

        <Button
          disabled={loading || !isFormValid()} // Disable if form is invalid
          className="bg-green-500 text-white"
          onClick={handleConfirm}
        >
          Place Order
        </Button>
      </div>
    </Modal>
  );
};
