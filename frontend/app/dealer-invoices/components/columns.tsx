// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { useState } from "react";
// import Cookies from "js-cookie";
// import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";
// import { sub } from "date-fns";
// import { toast } from "@/components/ui/use-toast";

// export type PlaceOrderColumn = {
//   id: string;
//   access_code: string;
//   status: string;
//   pickup_address: string;
//   supplier_username: string;
//   ProductDetail: {
//     sub_products: {
//       id: string; // Added this field
//       product_name: string;
//       product_type: string;
//       quantity: number;
//       delivery_date: string;
//       pickup_date: string;
//     }[];
//   };
// };

// export const columns: ColumnDef<PlaceOrderColumn>[] = [
//   {
//     accessorKey: "access_code",
//     header: "Access Code",
//   },
//   {
//     accessorKey: "pickup_address",
//     header: "Pickup Address",
//   },
//   {
//     accessorKey: "sub_products",
//     header: "Sub Products",
//     cell: ({ row }) => {
//       const subProducts = row.original.ProductDetail.sub_products;
//       const [modalStates, setModalStates] = useState<boolean[]>(
//         Array(subProducts.length).fill(false)
//       ); // Track open states for each sub-product modal
//       const [loading, setLoading] = useState(false);
//       const token = Cookies.get("authToken");
//       const [invoiceData, setInvoiceData] = useState({});
//       const [truck_company_username, setTruckCompanyUsername] = useState("");

//       const handleOpenModal = (index: number) => {
//         const newModalStates = [...modalStates];
//         newModalStates[index] = true;
//         setModalStates(newModalStates);
//       };

//       const handleCloseModal = (index: number) => {
//         const newModalStates = [...modalStates];
//         newModalStates[index] = false;
//         setModalStates(newModalStates);
//       };

//       const handleConfirm = async (subProductIds: string[]) => {
//         setLoading(true);

//         try {
//           const response = await fetch(
//             "http://127.0.0.1:8000/forward-invoice-to-truck-company/",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 truck_company_username: truck_company_username, // Add the truck company username here
//                 invoice_id: row.original.id,
//                 sub_product_ids: subProductIds, // Pass the array of sub-product IDs
//               }),
//             }
//           );

//           if (!row.original.id) {
//             throw new Error("Product ID is required");
//           }

//           const data = await response.json();
//           // if (data.invoice) {
//           //   setInvoiceData(data.invoice);
//           // }

//           if (response.status === 200) {
//             toast({
//               variant: "default",
//               description: data.message,
//             });
//           }
//         } catch (error: any) {
//           toast({
//             variant: "destructive",
//             description: error  .message,
//           })
//           console.error("Error generating invoice:", error.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       return (
//         <div>
//           {subProducts.map((subProduct, index) => (
//             <div
//               key={subProduct.id}
//               className="mb-2 p-2 border rounded flex justify-between items-center"
//             >
//               <div>
//                 <p>
//                   <strong>Product Name:</strong> {subProduct.product_name}
//                 </p>
//                 <p>
//                   <strong>Product Type:</strong> {subProduct.product_type}
//                 </p>
//                 <p>
//                   <strong>Quantity:</strong> {subProduct.quantity}
//                 </p>
//                 <p>
//                   <strong>Delivery Date:</strong> {subProduct.delivery_date}
//                 </p>
//                 <p>
//                   <strong>Pickup Date:</strong> {subProduct.pickup_date}
//                 </p>
//               </div>
//               <div>
//                 <Button onClick={() => handleOpenModal(index)}>
//                   Forward Invoice
//                 </Button>
//               </div>
//               <TruckInvoiceModal
//                 isOpen={modalStates[index]}
//                 onClose={() => handleCloseModal(index)}
//                 onConfirm={() => handleConfirm([subProduct.id])} // Pass the current sub-product ID as an array
//                 loading={loading}
//                 invoiceData={invoiceData}
//                 productId={row.original.id}
//                 // supplierUsername={setTruckCompanyUsername}
//                 setSupplierUsername={setTruckCompanyUsername}
//                 subProductIds={[subProduct.id]} // Pass the current sub-product ID as an array
//               />
//             </div>
//           ))}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Invoice Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status") as string;

//       return (
//         <Badge
//           className={cn(
//             status.toLowerCase().includes("pending")
//               ? "bg-yellow-500 text-white"
//               : status.toLowerCase().includes("cancelled")
//               ? "bg-red-500 text-white"
//               : status.toLowerCase().includes("confirmed")
//               ? "bg-blue-500 text-white"
//               : status.toLowerCase().includes("delivered")
//               ? "bg-green-500 text-white"
//               : "bg-gray-500 text-white"
//           )}
//         >
//           {status}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "supplier_username",
//     header: "Supplier Username",
//   },
// ];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";
import { toast } from "@/components/ui/use-toast";

export type PlaceOrderColumn = {
  id: string;
  access_code: string;
  status: string;
  pickup_address: string;
  supplier_username: string;
  ProductDetail: {
    sub_products: {
      id: string;
      product_name: string;
      product_type: string;
      quantity: number;
      delivery_date: string;
      pickup_date: string;
    }[];
  };
};

const SubProductsCell = ({ row }: { row: any }) => {
  const subProducts = row.original.ProductDetail.sub_products;
  const [modalStates, setModalStates] = useState<boolean[]>(Array(subProducts.length).fill(false));
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [truckCompanyUsername, setTruckCompanyUsername] = useState("");

  const token = Cookies.get("authToken");

  const handleOpenModal = (index: number) => {
    const newModalStates = [...modalStates];
    newModalStates[index] = true;
    setModalStates(newModalStates);
  };

  const handleCloseModal = (index: number) => {
    const newModalStates = [...modalStates];
    newModalStates[index] = false;
    setModalStates(newModalStates);
  };

  const handleConfirm = async (subProductIds: string[]) => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/forward-invoice-to-truck-company/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          truck_company_username: truckCompanyUsername,
          invoice_id: row.original.id,
          sub_product_ids: subProductIds,
        }),
      });

      if (!row.original.id) {
        throw new Error("Product ID is required");
      }

      const data = await response.json();

      if (response.status === 200) {
        toast({
          variant: "default",
          description: data.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message,
      });
      console.error("Error generating invoice:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {subProducts.map((subProduct: any, index: any) => (
        <div key={subProduct.id} className="mb-2 p-2 border rounded flex justify-between items-center">
          <div>
            <p><strong>Product Name:</strong> {subProduct.product_name}</p>
            <p><strong>Product Type:</strong> {subProduct.product_type}</p>
            <p><strong>Quantity:</strong> {subProduct.quantity}</p>
            <p><strong>Delivery Date:</strong> {subProduct.delivery_date}</p>
            <p><strong>Pickup Date:</strong> {subProduct.pickup_date}</p>
          </div>
          <div>
            <Button onClick={() => handleOpenModal(index)}>Forward Invoice</Button>
          </div>
          <TruckInvoiceModal
            isOpen={modalStates[index]}
            onClose={() => handleCloseModal(index)}
            onConfirm={() => handleConfirm([subProduct.id])}
            loading={loading}
            invoiceData={invoiceData}
            productId={row.original.id}
            setSupplierUsername={setTruckCompanyUsername}
            subProductIds={[subProduct.id]}
          />
        </div>
      ))}
    </div>
  );
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "access_code",
    header: "Access Code",
  },
  {
    accessorKey: "pickup_address",
    header: "Pickup Address",
  },
  {
    accessorKey: "sub_products",
    header: "Sub Products",
    cell: SubProductsCell, // Use the extracted component
  },
  {
    accessorKey: "status",
    header: "Invoice Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          className={cn(
            status.toLowerCase().includes("pending")
              ? "bg-yellow-500 text-white"
              : status.toLowerCase().includes("cancelled")
              ? "bg-red-500 text-white"
              : status.toLowerCase().includes("confirmed")
              ? "bg-blue-500 text-white"
              : status.toLowerCase().includes("delivered")
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "supplier_username",
    header: "Supplier Username",
  },
];
