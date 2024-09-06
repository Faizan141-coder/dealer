"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, SendHorizontal } from "lucide-react";
import { format } from "date-fns";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { SingleCombobox } from "../ui/combo";
import Cookies from "js-cookie";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (subOrder: any) => void;
  loading: boolean;
  dealerUsername: string;
  setDealerUsername: React.Dispatch<React.SetStateAction<string>>;
  initialSubOrder?: any;
}

export const AddModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  initialSubOrder,
  dealerUsername,
  setDealerUsername,
}) => {
  const [productName, setProductName] = useState(
    initialSubOrder?.product_name || ""
  );
  const [productType, setProductType] = useState(
    initialSubOrder?.product_type || ""
  );
  const [quantity, setQuantity] = useState(initialSubOrder?.quantity || 0);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(
    initialSubOrder?.delivery_date || null
  );
  const [deliveryTime, setDeliveryTime] = useState<string>(
    initialSubOrder?.delivery_time || "12:00"
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    initialSubOrder?.delivery_address || ""
  );
  const [dealers, setDealers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const token = Cookies.get("authToken");

  useEffect(() => {
    if (initialSubOrder) {
      setProductName(initialSubOrder.product_name);
      setProductType(initialSubOrder.product_type);
      setQuantity(initialSubOrder.quantity);
      setDeliveryDate(initialSubOrder.delivery_date);
      setDeliveryTime(initialSubOrder.delivery_time || "12:00");
      setDeliveryAddress(initialSubOrder.delivery_address);
    }
  }, [initialSubOrder]);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      getDealers(); // Fetch dealers when modal is opened
    }
  }, [isOpen]);

  const getDealers = async () => {
    try {
      const response = await fetch(
        `https://dealer-backend-kz82.vercel.app/get-all-dealers/`,
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
        setDealers(data.dealers); // Update state with fetched dealers
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
    const subOrder = {
      product_name: productName,
      product_type: productType,
      quantity,
      delivery_date: convertDateString(deliveryDate + "-" + deliveryTime), // Combine date and time
      delivery_address: deliveryAddress,
      dealer_username: dealerUsername,
    };
    onConfirm(subOrder);
    console.log(subOrder);
    onClose(); // Close the modal after confirming
  };

  return (
    <Modal
      title={initialSubOrder ? "Edit Sub-Order" : "Add Sub-Order"}
      description="Add a new sub-order by filling out the form below"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col space-y-4">
        <Input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
        />
        <Input
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          placeholder="Product Type"
        />
        <Input
          value={quantity}
          type="number"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          placeholder="Quantity"
        />
        <Input
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Delivery Address"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deliveryDate ? (
                <span>
                  {format(deliveryDate, "PPP")} {deliveryTime}{" "}
                  {/* Display time here */}
                </span>
              ) : (
                <span>Pick a date and time</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deliveryDate ?? undefined}
              onSelect={(day) => setDeliveryDate(day as Date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)} // Time input handler
        />
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
            itemText="Dealer"
            nothingFoundText="No Dealers Found."
            customWidth="w-[190px]"
            defaultValue={dealerUsername}
            setCurrentItem={setDealerUsername}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          disabled={loading}
          className="bg-green-500 text-white"
          onClick={handleConfirm}
        >
          {initialSubOrder ? "Update Sub-Order" : "Add Sub-Order"}
        </Button>
      </div>
    </Modal>
  );
};

function convertDateString(dateString: string): string {
  // Extract the date and time parts
  const [datePart, timePart] = dateString.split("-").map((part) => part.trim());

  // Remove the GMT and timezone part from the date string
  const dateWithoutTimezone = datePart.split(" GMT")[0];

  // Parse the date part manually
  const dateObject = new Date(dateWithoutTimezone);

  // Extract the hour and minute from the time part
  const [hour, minute] = timePart.split(":").map(Number);

  // Set the time on the date object
  dateObject.setHours(hour);
  dateObject.setMinutes(minute);

  // Format the final output
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return dateObject.toLocaleString("en-US", options).replace(",", "");
}
