"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { SingleCombobox } from "../ui/combo";
import Cookies from "js-cookie";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  loading: boolean;
  productId: string
  supplierUsername: string;
  setSupplierUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productId,
  supplierUsername,
  setSupplierUsername,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [dealers, setDealers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("authToken");

  // console.log("Token:", token);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      getDealers(); // Fetch dealers when modal is opened
    }
  }, [isOpen]);

  const getDealers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/get-all-suppliers/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setDealers(data.suppliers); // Update state with fetched dealers
      } else {
        setError("Failed to fetch dealers.");
      }
    } catch (err) {
      setError("An error occurred while fetching dealers.");
    }
  };

  // console.log("Dealers:", dealers);

  if (!isMounted) {
    return null;
  }

  const handleConfirm = () => {
    // const formattedDate = deliveryDate
    //   ? format(deliveryDate, "yyyy-MM-dd")
    //   : "";

    const requestData = {
      product_id: productId,
      supplier_username: supplierUsername,
    };

    console.log("Request Data:", requestData);
    onConfirm(requestData);
  };

  return (
    <Modal
      title="Generate Invoice"
      description="Please fill in the details below to generate an invoice."
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
              itemText="Supplier"
              nothingFoundText="No Suppliers Found."
              customWidth="w-full"
              defaultValue={dealers[0]}
              setCurrentItem={setSupplierUsername}
            />
          </div>
        </div>
        <Button
          disabled={loading}
          className="bg-green-500 focus:ring-green-500 hover:bg-green-400 text-white space-x-3"
          type="submit"
          onClick={handleConfirm}
        >
          <span>Generate Invoice</span>
          <SendHorizontal color="#fff" className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
      {/* Display error message */}
    </Modal>
  );
};

// "use client";

// import { useEffect, useState } from "react";
// import { CalendarIcon, SendHorizontal } from "lucide-react";
// import { format } from "date-fns";

// import { Modal } from "@/components/ui/modal";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { cn } from "@/lib/utils";
// import { Calendar } from "../ui/calendar";
// import { SingleCombobox } from "../ui/combo";
// import Cookies from "js-cookie";

// interface InvoiceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: (data: any) => void;
//   loading: boolean;
//   productName: string;
//   productType: string;
//   quantity: string;
//   status: string;
//   clientUsername: string;
//   // dealerU/erUsername: React.Dispatch<React.SetStateAction<string>>;
// }

// export const InvoiceModal: React.FC<InvoiceModalProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   loading,
//   productName,
//   productType,
//   quantity,
//   status,
//   clientUsername,
//   // dealerUsername,
//   // setDealerUsername,
// }) => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [dealers, setDealers] = useState<string[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const token = Cookies.get("authToken");

//   // console.log("Token:", token);

//   useEffect(() => {
//     setIsMounted(true);
//     if (isOpen) {
//       getDealers(); // Fetch dealers when modal is opened
//     }
//   }, [isOpen]);

//   const getDealers = async () => {
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/get-all-suppliers/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         const data = await response.json();
//         setDealers(data.suppliers); // Update state with fetched dealers
//       } else {
//         setError("Failed to fetch dealers.");
//       }
//     } catch (err) {
//       setError("An error occurred while fetching dealers.");
//     }
//   };

//   // console.log("Dealers:", dealers);

//   if (!isMounted) {
//     return null;
//   }

//   const handleConfirm = () => {
//     // const formattedDate = deliveryDate
//     //   ? format(deliveryDate, "yyyy-MM-dd")
//     //   : "";

//     const requestData = {
//       product_name: productName,
//       product_type: productType,
//       quantity: quantity,
//       status: status,
//       user_details: {
//         username: clientUsername,
//       }
//     };

//     console.log("Request Data:", requestData);
//     onConfirm(requestData);
//   };

//   return (
//     <Modal
//       title="Generate Invoice"
//       description="Please fill in the details below to generate an invoice."
//       isOpen={isOpen}
//       onClose={onClose}
//     >
//       <div className="flex flex-col items-center justify-center space-y-5">
//         <div className="w-full">
//           <div className="mt-5">
//             <SingleCombobox
//               items={
//                 dealers.length > 0
//                   ? dealers.map((dealer) => ({
//                       value: dealer,
//                       label: dealer,
//                     }))
//                   : []
//               }
//               itemText="Supplier"
//               nothingFoundText="No Suppliers Found."
//               customWidth="w-full"
//               // defaultValue={dealerUsername}
//               // setCurrentItem={setDealerUsername}
//             />
//           </div>
//         </div>
//         <Button
//           disabled={loading}
//           className="bg-green-500 focus:ring-green-500 hover:bg-green-400 text-white space-x-3"
//           type="submit"
//           onClick={handleConfirm}
//         >
//           <span>Generate Invoice</span>
//           <SendHorizontal color="#fff" className="h-4 w-4" />
//         </Button>
//       </div>
//       {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
//       {/* Display error message */}
//     </Modal>
//   );
// };
