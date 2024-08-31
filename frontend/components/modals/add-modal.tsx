"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, SendHorizontal } from "lucide-react";
import { format } from "date-fns";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { SingleCombobox } from "../ui/combo";
import Cookies from "js-cookie";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  productName: string;
  productType: string;
  quantity: number;
  deliveryDate: Date;
  dealerUsername: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  setProductType: React.Dispatch<React.SetStateAction<string>>;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  setDeliveryDate: React.Dispatch<React.SetStateAction<Date>>;
  setDealerUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const AddModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productName,
  productType,
  quantity,
  deliveryDate,
  dealerUsername,
  setProductName,
  setProductType,
  setQuantity,
  setDeliveryDate,
  setDealerUsername,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [dealers, setDealers] = useState<{ value: string; label: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("authToken");

  console.log("Token:", token);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      getDealers(); // Fetch dealers when modal is opened
    }
  }, [isOpen]);

  const getDealers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get-all-dealers/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
       
        const dealers = data.map((dealer: any) => ({
          value: dealer.username,
          label: dealer.username,
        }))
        setDealers(data);
      } else {
        setError("Failed to fetch dealers.");
      }
    } catch (err) {
      setError("An error occurred while fetching dealers.");
    }
  };

  console.log("Dealers:", dealers);

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    const formattedDate = deliveryDate
      ? format(deliveryDate, "yyyy-MM-dd")
      : "";

    const requestData = {
      product_name: productName,
      product_type: productType,
      quantity: quantity,
      delivery_date: formattedDate,
      dealer_username: dealerUsername,
    };

    console.log("Request Data:", requestData);
    onConfirm(requestData);
  };

  return (
    <Modal
      title="Create Order"
      description="Create a new order by filling out the form below"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center space-x-4">
        <div className="w-full">
          <div className="grid flex-1 gap-2">
            <select
              className="w-full px-3 py-2 border bg-white rounded-lg placeholder:text-gray-200 focus:outline-black border-gray-200"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            >
              <option>Select Product</option>
              <option value="cement">Cement</option>
            </select>
          </div>
          <div className="mt-5">
            <select
              className="w-full px-3 py-2 border bg-white rounded-lg placeholder:text-gray-200 focus:outline-black border-gray-200"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option>Select Product Type</option>
              <option value="type_1">Type 1</option>
              <option value="type_2">Type 2</option>
            </select>
          </div>
          <div className="mt-5">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deliveryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? (
                    format(deliveryDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={(day) => setDeliveryDate(day as Date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex space-x-2">
            <div className="mt-5">
              <Input
                id="quantity"
                value={quantity}
                type="number"
                className="focus:ring-black"
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                placeholder="Add a quantity"
              />
            </div>
            <div className="mt-5">
              <SingleCombobox
                items={dealers} // Use the state variable for dealers
                itemText="Dealer"
                nothingFoundText="No Dealers Found."
                customWidth="w-[190px]"
                defaultValue={dealerUsername}
                setCurrentItem={setDealerUsername}
              />
            </div>
          </div>
        </div>
        <Button
          disabled={loading}
          className="bg-green-500 focus:ring-green-500 text-white"
          type="submit"
          size="sm"
          onClick={handleConfirm}
        >
          <span className="sr-only">Send</span>
          <SendHorizontal color="#fff" className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error message */}
    </Modal>
  );
};
