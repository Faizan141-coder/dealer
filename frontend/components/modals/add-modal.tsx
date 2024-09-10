"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SingleCombobox } from "../ui/combo";

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
  const [deliveryDate, setDeliveryDate] = useState<Date>(
    initialSubOrder?.delivery_date || null
  );
  // const [deliveryTime, setDeliveryTime] = useState<string>(
  //   initialSubOrder?.delivery_time || "12:00"
  // );
  const [deliveryAddress, setDeliveryAddress] = useState(
    initialSubOrder?.delivery_address || ""
  );
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

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
      // setDeliveryTime(initialSubOrder.delivery_time || "12:00");
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
      const response = await fetch(`http://127.0.0.1:8000/get-all-dealers/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
      // delivery_date: convertDateString(deliveryDate + "-" + deliveryTime), // Combine date and time
      delivery_date: deliveryDate, // Combine date and time
      delivery_address: streetAddress + ", " + city + ", " + state + ", " + zipCode,
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
        <Select onValueChange={setProductName}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Cement">Cement</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={setProductType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="type_1">Type 1</SelectItem>
              <SelectItem value="type_2">Type 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          value={quantity}
          type="number"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          placeholder="Quantity"
        />
        <div>
          <div className=" flex space-x-5">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
            />
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />
          </div>
          <div className="mt-5 flex space-x-5">
            <Input
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Zip Code"
            />
            <Input
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Street Address"
            />
          </div>
        </div>
        <div className="required w-full">
  <DatePicker
    selected={deliveryDate}
    className="border-gray-200 p-2 border-2 rounded-md w-full"
    onChange={(
      date: Date | null,
      event?: React.SyntheticEvent<any> | undefined
    ) => setDeliveryDate(date)}
    showTimeSelect
    timeFormat="HH:mm"
    timeIntervals={1}
    timeCaption="time"
    dateFormat="MMMM d, yyyy h:mm aa"
    wrapperClassName="w-full"
    placeholderText="Pick a date and time for delivery"
    required
  />
</div>


        {/* <div className="mt-5">
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
        </div> */}
        {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
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

// function convertDateString(dateString: string): string {
//   // Extract the date and time parts
//   const [datePart, timePart] = dateString.split("-").map((part) => part.trim());

//   // Remove the GMT and timezone part from the date string
//   const dateWithoutTimezone = datePart.split(" GMT")[0];

//   // Parse the date part manually
//   const dateObject = new Date(dateWithoutTimezone);

//   // Extract the hour and minute from the time part
//   const [hour, minute] = timePart.split(":").map(Number);

//   // Set the time on the date object
//   dateObject.setHours(hour);
//   dateObject.setMinutes(minute);

//   // Format the final output
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   };

//   return dateObject.toLocaleString("en-US", options).replace(",", "");
// }
