// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { Badge } from "@/components/ui/badge";
// import { useState } from "react";
// import Cookies from "js-cookie";
// import toast from "react-hot-toast";
// import { SupplierInvoiceModal } from "@/components/modals/supplier-invoice-modal";

// export type PlaceOrderColumn = {
//   id: string;
//   product_name: string;
//   product_type: string;
//   product_quantity: string;
//   client_address: string;
//   delivery_date: string;
//   status: string;
// };

// export const columns: ColumnDef<PlaceOrderColumn>[] = [
//   {
//     accessorKey: "product_name",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           className="hover:bg-slate-100 transition duration-100"
//         >
//           Product Name
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "product_quantity",
//     header: "Quantity",
//   },
//   {
//     accessorKey: "client_address",
//     header: "Client Address",
//   },
//   {
//     accessorKey: "product_type",
//     header: "Product Type",
//     cell: ({ row }) => {
//       const type = row.getValue("product_type") as string;

//       return (
//         <Badge
//           className={cn(
//             type === "Electronics"
//               ? "bg-blue-500 text-white"
//               : "bg-pink-500 text-white"
//           )}
//         >
//           {type}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "delivery_date",
//     header: "Delivery Date",
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("delivery_date") as string);
//       const formattedDate = date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });

//       return <span>{formattedDate}</span>;
//     },
//   },
//   {
//     accessorKey: "invoice",
//     header: "Invoice",
//     cell: ({ row }) => {
//       const [addModalOpen, setAddModalOpen] = useState(false);
//       const [loading, setLoading] = useState(false);
//       const token = Cookies.get("authToken");
//       const [invoiceData, setInvoiceData] = useState({});

//       const status = row.getValue("status") as string;
//       console.log("Status:", status);

//       const handleOpenModal = () => {
//         console.log("Modal opening...");
//         setAddModalOpen(true);
//       };

//       const handleConfirm = async () => {
//         setLoading(true);

//         try {
//           const response = await fetch(
//             `http://127.0.0.1:8000/create-invoice/`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//               body: JSON.stringify({
//                 invoice_id: row.original.id,
//                 pickup_date: new Date(),
//               }),
//             }
//           );

//           if (!row.original.id) {
//             throw new Error("Product ID is required");
//           }

//           const data = await response.json();
//           console.log("Full Response Data:", data);
//           console.log("Invoice Data:", data.invoice);

//           if (data.invoice) {
//             setInvoiceData(data.invoice);
//           } else {
//             console.error("Invoice data is missing from the response");
//           }

//           if (response.status === 201 || response.status === 200) {
//             toast.success("Invoice generated successfully");
//             console.log("Invoice generated successfully");
//           }
//         } catch (error: any) {
//           toast.error("Failed to generate invoice");
//           console.error("Error generating invoice:", error.message);
//         } finally {
//           setLoading(false);
//         }

//         setAddModalOpen(false);
//       };

//       console.log("Invoice Data:", invoiceData);

//       return (
//         <>
//           <Button onClick={handleOpenModal} disabled={status === "Confirmed"}>
//             Generate Invoice
//           </Button>
//           <SupplierInvoiceModal
//             isOpen={addModalOpen}
//             onClose={() => setAddModalOpen(false)}
//             onConfirm={handleConfirm}
//             loading={loading}
//             invoiceData={invoiceData}
//             productId={row.original.id}
//           />
//         </>
//       );
//     },
//   },
// ];

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { SupplierInvoiceModal } from "@/components/modals/supplier-invoice-modal";

export type PlaceOrderColumn = {
  id: string;
  status: string;
  dealer_username: string;
  ProductDetail: {
    status: string;
    sub_products: {
      product_name: string;
      product_type: string;
      quantity: string;
      delivery_date: string;
    }[];
  };
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dealer_username",
    header: "Dealer Username",
  },
  {
    accessorKey: "sub_products",
    header: "Sub Products",
    cell: ({ row }) => {
      const subProducts = row.original.ProductDetail.sub_products;

      return (
        <div>
          {subProducts.map((subProduct, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <p>
                <strong>Product Name:</strong> {subProduct.product_name}
              </p>
              <p>
                <strong>Product Type:</strong> {subProduct.product_type}
              </p>
              <p>
                <strong>Quantity:</strong> {subProduct.quantity}
              </p>
              <p>
                <strong>Delivery Date:</strong> {subProduct.delivery_date}
              </p>
            </div>
          ))}
        </div>
      );
    },
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
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => {
      const [addModalOpen, setAddModalOpen] = useState(false);
      const [loading, setLoading] = useState(false);
      const token = Cookies.get("authToken");
      const [invoiceData, setInvoiceData] = useState({});

      const status = row.getValue("status") as string;
      console.log("Status:", status);

      const handleOpenModal = () => {
        console.log("Modal opening...");
        setAddModalOpen(true);
      };

      const handleConfirm = async () => {
        setLoading(true);

        try {
          const response = await fetch(
            `http://127.0.0.1:8000/create-invoice/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                invoice_id: row.original.id,
                pickup_date: new Date(),
              }),
            }
          );

          if (!row.original.id) {
            throw new Error("Product ID is required");
          }

          const data = await response.json();
          console.log("Full Response Data:", data);
          console.log("Invoice Data:", data.invoice);

          if (data.invoice) {
            setInvoiceData(data.invoice);
          } else {
            console.error("Invoice data is missing from the response");
          }

          if (response.status === 201 || response.status === 200) {
            toast.success("Invoice generated successfully");
            console.log("Invoice generated successfully");
          }
        } catch (error: any) {
          toast.error("Failed to generate invoice");
          console.error("Error generating invoice:", error.message);
        } finally {
          setLoading(false);
        }

        setAddModalOpen(false);
      };

      console.log("Invoice Data:", invoiceData);

      return (
        <>
          <Button onClick={handleOpenModal} disabled={status === "Confirmed"}>
            Generate Invoice
          </Button>
          <SupplierInvoiceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onConfirm={handleConfirm}
            loading={loading}
            invoiceData={invoiceData}
            productId={row.original.id}
          />
        </>
      );
    },
  },
];
