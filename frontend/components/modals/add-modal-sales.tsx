"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import Cookies from "js-cookie";
import { SingleCombobox } from "../ui/combo";

interface AddModalSalesProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (subOrder: any) => void;
  loading: boolean;
  dealerUsername: string;
  setDealerUsername: React.Dispatch<React.SetStateAction<string>>;
  initialSubOrder?: any;
}

export const AddModalSales: React.FC<AddModalSalesProps> = ({
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
  const [deliveryAddress, setDeliveryAddress] = useState(
    initialSubOrder?.delivery_address || ""
  );
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const token = Cookies.get("authToken");
  const [clients, setClients] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (initialSubOrder) {
      setProductName(initialSubOrder.product_name);
      setProductType(initialSubOrder.product_type);
      setQuantity(initialSubOrder.quantity);
      setDeliveryDate(initialSubOrder.delivery_date);
      setDeliveryAddress(initialSubOrder.delivery_address);
    }
  }, [initialSubOrder]);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      getClients(); // Fetch dealers when modal is opened
    }
  }, [isOpen]);

  const getClients = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/get-all-clients/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setClients(data.clients); // Update state with fetched dealers
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
    return (
      productName.trim() !== "" &&
      productType.trim() !== "" &&
      quantity > 0 &&
      deliveryDate !== null &&
      city.trim() !== "" &&
      state.trim() !== "" &&
      zipCode.trim() !== "" &&
      streetAddress.trim() !== ""
    );
  };

  const handleConfirm = () => {
    const subOrder = {
      product_name: productName,
      product_type: productType,
      quantity,
      delivery_date: deliveryDate, // Combine date and time
      delivery_address:
        streetAddress + ", " + city + ", " + state + ", " + zipCode,
      client_username: dealerUsername,
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

        <Button
          disabled={loading || !isFormValid()} // Disable if form is invalid
          className="bg-green-500 text-white"
          onClick={handleConfirm}
        >
          {initialSubOrder ? "Update Sub-Order" : "Add Sub-Order"}
        </Button>
      </div>
    </Modal>
  );
};
