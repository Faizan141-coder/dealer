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
//   pickup_address: string;
//   pickup_date: string;
//   product_name: string;
//   product_type: string;
//   quantity: string;
//   delivery_date: string;
//   delivery_address: string;
//   client_name: string;
//   client_phone_number: string;
//   supplier_name: string;
//   supplier_phone: string;
//   dealer_name: string;
//   dealer_phone: string;
// };

// export const columns: ColumnDef<PlaceOrderColumn>[] = [
//   {
//     accessorKey: "pickup_address",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           className="hover:bg-slate-100 transition duration-100"
//         >
//           Pickup Address
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "pickup_date",
//     header: "Pickup Date",
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("pickup_date") as string);
//       const formattedDate = date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });

//       return <span>{formattedDate}</span>;
//     },
//   },
//   {
//     accessorKey: "product_name",
//     header: "Product Name",
//   },
//   {
//     accessorKey: "product_type",
//     header: "Product Type",
//     cell: ({ row }) => {
//       const type = row.getValue("product_type") as string;

//       return (
//         <Badge
//           className={cn(
//             type === "type_1"
//               ? "bg-blue-500 text-white"
//               : "bg-pink-500 text-white"
//           )}
//         >
//           {type === "type_1" ? "Type 1" : "Type 2"}
//         </Badge>
//       );
//     },
//   },
//   {
//     accessorKey: "quantity",
//     header: "Quantity",
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
//     accessorKey: "delivery_address",
//     header: "Delivery Address",
//   },
//   {
//     accessorKey: "client_name",
//     header: "Client Name",
//   },
//   {
//     accessorKey: "client_phone_number",
//     header: "Client Phone Number",
//   },
//   {
//     accessorKey: "supplier_name",
//     header: "Supplier Name",
//   },
//   {
//     accessorKey: "supplier_phone",
//     header: "Supplier Phone",
//   },
//   {
//     accessorKey: "dealer_name",
//     header: "Dealer Name",
//   },
//   {
//     accessorKey: "dealer_phone",
//     header: "Dealer Phone",
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

//           // Read the response body as JSON
//           const data = await response.json();
//           console.log("Full Response Data:", data);
//           console.log("Invoice Data:", data.invoice);

//           // Check if invoice data is available
//           if (data.invoice) {
//             setInvoiceData(data.invoice);
//           } else {
//             console.error("Invoice data is missing from the response");
//           }

//           // Check response status
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
//           {/* <SupplierInvoiceModal
//             isOpen={addModalOpen}
//             onClose={() => setAddModalOpen(false)}
//             onConfirm={handleConfirm}
//             loading={loading}
//             invoiceData={invoiceData}
//             productId={row.original.id}
//           /> */}
//         </>
//       );
//     },
//   },
// ];

// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import { Badge } from "@/components/ui/badge"
// import { useState } from "react"
// import Cookies from "js-cookie"
// import toast from "react-hot-toast"
// import { SupplierInvoiceModal } from "@/components/modals/supplier-invoice-modal"

// export type PlaceOrderColumn = {
//   id: string
//   pickup_address: string
//   pickup_date: string
//   product_name: string
//   product_type: string
//   quantity: string
//   delivery_date: string
//   delivery_address: string
//   client_name: string
//   client_phone_number: string
//   supplier_name: string
//   supplier_phone: string
//   dealer_name: string
//   dealer_phone: string
// }

// export const columns: ColumnDef<PlaceOrderColumn>[] = [
//   {
//     accessorKey: "pickup_address",
//     header: "Pickup Address",
//     cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("pickup_address")}</div>,
//   },
//   {
//     accessorKey: "pickup_date",
//     header: "Pickup Date",
//   },
//   {
//     accessorKey: "product_name",
//     header: "Product Name",
//     cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("product_name")}</div>,
//   },
//   {
//     accessorKey: "product_type",
//     header: "Product Type",
//     cell: ({ row }) => {
//       const type = row.getValue("product_type") as string
//       return (
//         <Badge
//           className={cn(
//             "whitespace-nowrap",
//             type === "type_1" ? "bg-blue-500 text-white" : "bg-pink-500 text-white"
//           )}
//         >
//           {type === "type_1" ? "Type 1" : "Type 2"}
//         </Badge>
//       )
//     },
//   },
//   {
//     accessorKey: "quantity",
//     header: "Quantity",
//     cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
//   },
//   {
//     accessorKey: "delivery_date",
//     header: "Delivery Date",
//   },
//   {
//     accessorKey: "delivery_address",
//     header: "Delivery Address",
//     cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("delivery_address")}</div>,
//   },
//   {
//     accessorKey: "client_name",
//     header: "Client Name",
//     cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("client_name")}</div>,
//   },
//   {
//     accessorKey: "client_phone_number",
//     header: "Client Phone",
//     cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("client_phone_number")}</div>,
//   },
//   {
//     accessorKey: "supplier_name",
//     header: "Supplier Name",
//     cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("supplier_name")}</div>,
//   },
//   {
//     accessorKey: "supplier_phone",
//     header: "Supplier Phone",
//     cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("supplier_phone")}</div>,
//   },
//   {
//     accessorKey: "dealer_name",
//     header: "Dealer Name",
//     cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue("dealer_name")}</div>,
//   },
//   {
//     accessorKey: "invoice",
//     header: "Invoice",
//     cell: ({ row }) => {
//       const [addModalOpen, setAddModalOpen] = useState(false)
//       const [loading, setLoading] = useState(false)
//       const token = Cookies.get("authToken")
//       const [invoiceData, setInvoiceData] = useState({})

//       const handleOpenModal = () => {
//         setAddModalOpen(true)
//       }

//       const handleConfirm = async () => {
//         setLoading(true)
//         try {
//           const response = await fetch(`http://127.0.0.1:8000/create-invoice/`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               invoice_id: row.original.id,
//               pickup_date: new Date(),
//             }),
//           })

//           const data = await response.json()
//           if (data.invoice) {
//             setInvoiceData(data.invoice)
//             toast.success("Invoice generated successfully")
//           } else {
//             throw new Error("Invoice data is missing from the response")
//           }
//         } catch (error: any) {
//           toast.error("Failed to generate invoice")
//           console.error("Error generating invoice:", error.message)
//         } finally {
//           setLoading(false)
//           setAddModalOpen(false)
//         }
//       }

//       return (
//         <>
//           <Button onClick={handleOpenModal} className="whitespace-nowrap">
//             Generate Invoice
//           </Button>
//           {/* Uncomment and update SupplierInvoiceModal when it's available */}
//           {/* <SupplierInvoiceModal
//             isOpen={addModalOpen}
//             onClose={() => setAddModalOpen(false)}
//             onConfirm={handleConfirm}
//             loading={loading}
//             invoiceData={invoiceData}
//             productId={row.original.id}
//           /> */}
//         </>
//       )
//     },
//   },
// ]

// export default function Component() {
//   // This is a placeholder for the actual table component
//   // You'll need to implement the table using a library like @tanstack/react-table
//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border-collapse">
//         <thead>
//         </thead>
//         <tbody>
//           {/* Placeholder for table rows */}
//           <tr>
//             <td colSpan={columns.length} className="p-2 text-center">
//               Table data would be rendered here
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   )
// }

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { SupplierInvoiceModal } from "@/components/modals/supplier-invoice-modal";
import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";
import { DriverInvoiceModal } from "@/components/modals/driver-invocie-modal";

export type PlaceOrderColumn = {
  id: string;
  pickup_address: string;
  pickup_date: string;
  product_name: string;
  product_type: string;
  quantity: string;
  delivery_date: string;
  delivery_address: string;
  client_name: string;
  client_phone_number: string;
  supplier_name: string;
  supplier_phone: string;
  dealer_name: string;
  dealer_phone: string;
  supplier_invoice_id: string;
  dealer_invoice_id: string;
  sub_product_id: string;
  status: string;
};

// New component to handle invoice generation
const InvoiceButton = ({ row }: { row: any }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const token = Cookies.get("authToken");
  const [driverUsername, setDriverUsername] = useState("");
  const [truckPlateNumber, setTruckPlateNumber] = useState<string>("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState<string>("");
  const [driverAddress, setDriverAddress] = useState<string>("");
  const [driverEmail, setDriverEmail] = useState<string>("");
  const [driverFullName, setDriverFullName] = useState<string>("");


  const status = row.getValue("status") as string;

  const handleOpenModal = () => {
    setAddModalOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/assign-to-driver/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            driver_username: driverFullName,
            truck_plate_number: truckPlateNumber,
            driver_phone_number: driverPhoneNumber,
            driver_address: driverAddress,
            driver_email: driverEmail,
            sub_product_id: row.original.sub_product_id,
            dealer_invoice_id: row.original.dealer_invoice_id,
          }),
        }
      );

      const data = await response.json();

      console.log(data)
      // if (data.invoice) {
      //   setInvoiceData(data.invoice);
      //   toast.success("Invoice generated successfully");
      // } else {
      //   throw new Error("Invoice data is missing from the response");
      // }
    } catch (error: any) {
      // toast.error("Failed to generate invoice");
      console.error("Error generating invoice:", error.message);
    } finally {
      setLoading(false);
      setAddModalOpen(false);
    }
  };

  // disabled={status !== "Pending with truck"}
  return (
    <>
      <Button onClick={handleOpenModal} className="whitespace-nowrap">
        Generate Invoice
      </Button>
      <DriverInvoiceModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={() => handleConfirm()}
        loading={loading}
        invoiceData={invoiceData}
        setDriverFullName={setDriverFullName}
        setTruckPlateNumber={setTruckPlateNumber}
        setDriverPhoneNumber={setDriverPhoneNumber}
        setDriverAddress={setDriverAddress}
        setDriverEmail={setDriverEmail}
        driverFullName={driverFullName}
        truckPlateNumber={truckPlateNumber}
        driverPhoneNumber={driverPhoneNumber}
        driverAddress={driverAddress}
        driverEmail={driverEmail}
        subProductId={row.original.sub_product_id}
        supplierInvoiceId={row.original.supplier_invoice_id}
        dealerInvoiceId={row.original.dealer_invoice_id}
      />
    </>
  );
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "pickup_address",
    header: "Pickup Address",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("pickup_address")}
      </div>
    ),
  },
  {
    accessorKey: "pickup_date",
    header: "Pickup Date",
  },
  {
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("product_name")}
      </div>
    ),
  },
  {
    accessorKey: "product_type",
    header: "Product Type",
    cell: ({ row }) => {
      const type = row.getValue("product_type") as string;
      return (
        <Badge
          className={cn(
            "whitespace-nowrap",
            type === "type_1"
              ? "bg-blue-500 text-white"
              : "bg-pink-500 text-white"
          )}
        >
          {type === "type_1" ? "Type 1" : "Type 2"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("quantity")}</div>
    ),
  },
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
  },
  {
    accessorKey: "delivery_address",
    header: "Delivery Address",
    cell: ({ row }) => (
      <div className="">
        {row.getValue("delivery_address")}
      </div>
    ),
  },
  {
    accessorKey: "client_name",
    header: "Client Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("client_name")}
      </div>
    ),
  },
  {
    accessorKey: "client_phone_number",
    header: "Client Phone",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("client_phone_number")}
      </div>
    ),
  },
  {
    accessorKey: "supplier_name",
    header: "Supplier Name",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">
        {row.getValue("supplier_name")}
      </div>
    ),
  },
  {
    accessorKey: "supplier_phone",
    header: "Supplier Phone",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue("supplier_phone")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue("status")}</div>
    ),
  },
  // {
  //   accessorKey: "dealer_name",
  //   header: "Dealer Name",
  //   cell: ({ row }) => (
  //     <div className="max-w-[150px] truncate">
  //       {row.getValue("dealer_name")}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => <InvoiceButton row={row} />, // Use the new component
  },
];

export default function Component() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead></thead>
        <tbody>
          <tr>
            <td colSpan={columns.length} className="p-2 text-center">
              Table data would be rendered here
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
