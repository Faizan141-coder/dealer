"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, SendHorizontal } from "lucide-react";
import { format } from "date-fns"; // Import format from date-fns

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void; // Accepting the data to be sent
  loading: boolean;
  productName: string;
  productType: string;
  quantity: number;
  deliveryDate: Date;
  // address: string;
  dealerUsername: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  setProductType: React.Dispatch<React.SetStateAction<string>>;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  setDeliveryDate: React.Dispatch<React.SetStateAction<Date>>;
  // setAddress: React.Dispatch<React.SetStateAction<string>>;
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
  // address,
  dealerUsername,
  setProductName,
  setProductType,
  setQuantity,
  setDeliveryDate,
  // setAddress,
  setDealerUsername,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Function to handle the confirmation and data submission
  const handleConfirm = () => {
    const formattedDate = deliveryDate
      ? format(deliveryDate, "yyyy-MM-dd")
      : ""; // Format date as yyyy-MM-dd

    const requestData = {
      product_name: productName,
      product_type: productType,
      quantity: quantity,
      delivery_date: formattedDate, // Use the formatted date
      // delivery_address: address,
      dealer_username: dealerUsername,
    };

    console.log("Request Data:", requestData);
    onConfirm(requestData); // Pass the data to the onConfirm function
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
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
          {/* <div className="mt-5">
            <Input
              id="delivery_address"
              value={address}
              type="text"
              className="focus:ring-black"
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Add address"
            />
          </div> */}
          <div className="mt-5">
            <select
              className="w-full px-3 py-2 border bg-white rounded-lg placeholder:text-gray-200 focus:outline-black border-gray-200"
              value={dealerUsername}
              onChange={(e) => setDealerUsername(e.target.value)}
            >
              <option>Select Dealer</option>
              <option value="dealer">Dealer</option>
            </select>
          </div>
        </div>
        <Button
          disabled={loading}
          className="bg-green-500 focus:ring-green-500 text-white"
          type="submit"
          size="sm"
          onClick={handleConfirm} // Updated to handleConfirm to use formatted date
        >
          <span className="sr-only">Send</span>
          <SendHorizontal color="#fff" className="h-4 w-4" />
        </Button>
      </div>
    </Modal>
  );
};
