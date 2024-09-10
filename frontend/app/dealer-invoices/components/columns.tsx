"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Cookies from "js-cookie";
import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal";
import { toast } from "@/components/ui/use-toast";
import { error } from "console";

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
      sub_status: string;
      actual_quantity:string;
    }[];
  };
};

const SubProductsCell = ({ row }: { row: any }) => {
  const subProducts = row.original.ProductDetail.sub_products;
  const [modalStates, setModalStates] = useState<boolean[]>(
    Array(subProducts.length).fill(false)
  );
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
      const response = await fetch(
        "http://127.0.0.1:8000/forward-invoice-to-truck-company/",
        {
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
        }
      );

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

  const confirmStatus = async (subProductId: string) => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/delivery-confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sub_product_id: subProductId,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast({
          variant: "default",
          description: "Delivery confirmed successfully",
        });
      }
    } catch {
      console.error("Error confirming status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {subProducts.map((subProduct: any, index: any) => (
        <div
          key={subProduct.id}
          className="mb-2 p-2 border rounded flex justify-between items-center"
        >
          <div>
            <p>
              <strong>Product Id: </strong> {subProduct.id}
            </p>
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
              <strong>Actual Quantity</strong> {subProduct.actual_quantity}
            </p>
            <p>
              <strong>Delivery Date:</strong> {subProduct.delivery_date}
            </p>
            <p>
              <strong>Status:</strong> {subProduct.sub_status}
            </p>
          </div>
          <div>
            <Button
              onClick={() => confirmStatus(subProduct.id)}
              disabled={subProduct.sub_status.toLowerCase() === "delivered"}
            >
              {subProduct.sub_status.toLowerCase() === "delivered"
                ? "Delivered"
                : "Confirm Delivery"}
            </Button>
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
    accessorKey: "id",
    header: "ID",
  },
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

// "use client"

// import { useState } from "react"
// import { ColumnDef } from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import { Badge } from "@/components/ui/badge"
// import Cookies from "js-cookie"
// import { TruckInvoiceModal } from "@/components/modals/truck-invocie-modal"
// import { toast } from "@/components/ui/use-toast"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { DataTable } from "@/components/ui/data-table"
// import { ArrowUpDown, Truck, Package, Calendar, CheckCircle } from "lucide-react"

// export type PlaceOrderColumn = {
//   id: string
//   access_code: string
//   status: string
//   pickup_address: string
//   supplier_username: string
//   ProductDetail: {
//     sub_products: {
//       id: string
//       product_name: string
//       product_type: string
//       quantity: number
//       delivery_date: string
//       pickup_date: string
//       sub_status: string
//       actual_quantity: string
//     }[]
//   }
// }

// const SubProductsCell = ({ row }: { row: any }) => {
//   const subProducts = row.original.ProductDetail.sub_products
//   const [modalStates, setModalStates] = useState<boolean[]>(Array(subProducts.length).fill(false))
//   const [loading, setLoading] = useState(false)
//   const [invoiceData, setInvoiceData] = useState({})
//   const [truckCompanyUsername, setTruckCompanyUsername] = useState("")

//   const token = Cookies.get("authToken")

//   const handleOpenModal = (index: number) => {
//     const newModalStates = [...modalStates]
//     newModalStates[index] = true
//     setModalStates(newModalStates)
//   }

//   const handleCloseModal = (index: number) => {
//     const newModalStates = [...modalStates]
//     newModalStates[index] = false
//     setModalStates(newModalStates)
//   }

//   const handleConfirm = async (subProductIds: string[]) => {
//     setLoading(true)

//     try {
//       const response = await fetch("http://127.0.0.1:8000/forward-invoice-to-truck-company/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           truck_company_username: truckCompanyUsername,
//           invoice_id: row.original.id,
//           sub_product_ids: subProductIds,
//         }),
//       })

//       if (!row.original.id) {
//         throw new Error("Product ID is required")
//       }

//       const data = await response.json()

//       if (response.status === 200) {
//         toast({
//           variant: "default",
//           description: data.message,
//         })
//       }
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         description: error.message,
//       })
//       console.error("Error generating invoice:", error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const confirmStatus = async (subProductId: string) => {
//     try {
//       setLoading(true)

//       const response = await fetch("http://127.0.0.1:8000/delivery-confirm/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           sub_product_id: subProductId,
//         }),
//       })

//       const data = await response.json()

//       if (response.status === 200) {
//         toast({
//           variant: "default",
//           description: "Delivery confirmed successfully",
//         })
//       }
//     } catch {
//       console.error("Error confirming status")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <ScrollArea className="h-[300px]">
//       {subProducts.map((subProduct: any, index: any) => (
//         <Card key={subProduct.id} className="mb-4">
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold">Product ID: {subProduct.id}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center">
//                 <Package className="mr-2 h-4 w-4" />
//                 <span className="font-medium">Product Name:</span> {subProduct.product_name}
//               </div>
//               <div className="flex items-center">
//                 <Truck className="mr-2 h-4 w-4" />
//                 <span className="font-medium">Product Type:</span> {subProduct.product_type}
//               </div>
//               <div className="flex items-center">
//                 <ArrowUpDown className="mr-2 h-4 w-4" />
//                 <span className="font-medium">Quantity:</span> {subProduct.quantity * 25}
//               </div>
//               <div className="flex items-center">
//                 <CheckCircle className="mr-2 h-4 w-4" />
//                 <span className="font-medium">Actual Quantity:</span> {subProduct.actual_quantity}
//               </div>
//               <div className="flex items-center">
//                 <Calendar className="mr-2 h-4 w-4" />
//                 <span className="font-medium">Delivery Date:</span> {subProduct.delivery_date}
//               </div>
//               <div className="flex items-center">
//                 <Badge
//                   variant="outline"
//                   className={cn(
//                     "text-xs font-semibold",
//                     subProduct.sub_status.toLowerCase() === "delivered" && "bg-green-100 text-green-800",
//                     subProduct.sub_status.toLowerCase() === "pending" && "bg-yellow-100 text-yellow-800"
//                   )}
//                 >
//                   {subProduct.sub_status}
//                 </Badge>
//               </div>
//             </div>
//             <Separator className="my-4" />
//             <div className="flex justify-end">
//               <Button
//                 onClick={() => confirmStatus(subProduct.id)}
//                 disabled={subProduct.sub_status.toLowerCase() === "delivered"}
//                 variant={subProduct.sub_status.toLowerCase() === "delivered" ? "outline" : "default"}
//               >
//                 {subProduct.sub_status.toLowerCase() === "delivered" ? "Delivered" : "Confirm Delivery"}
//               </Button>
//             </div>
//           </CardContent>
//           <TruckInvoiceModal
//             isOpen={modalStates[index]}
//             onClose={() => handleCloseModal(index)}
//             onConfirm={() => handleConfirm([subProduct.id])}
//             loading={loading}
//             invoiceData={invoiceData}
//             productId={row.original.id}
//             setSupplierUsername={setTruckCompanyUsername}
//             subProductIds={[subProduct.id]}
//           />
//         </Card>
//       ))}
//     </ScrollArea>
//   )
// }

// export const columns: ColumnDef<PlaceOrderColumn>[] = [
//   {
//     accessorKey: "id",
//     header: "ID",
//   },
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
//     cell: SubProductsCell,
//   },
//   {
//     accessorKey: "status",
//     header: "Invoice Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status") as string
//       return (
//         <Badge
//           className={cn(
//             "text-xs font-semibold",
//             status.toLowerCase().includes("pending") && "bg-yellow-100 text-yellow-800",
//             status.toLowerCase().includes("cancelled") && "bg-red-100 text-red-800",
//             status.toLowerCase().includes("confirmed") && "bg-blue-100 text-blue-800",
//             status.toLowerCase().includes("delivered") && "bg-green-100 text-green-800"
//           )}
//         >
//           {status}
//         </Badge>
//       )
//     },
//   },
//   {
//     accessorKey: "supplier_username",
//     header: "Supplier Username",
//   },
// ]

// export default function OrderTable({ data }: { data: PlaceOrderColumn[] }) {
//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>Order Table</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <DataTable columns={columns} data={data} searchKey={""} />
//       </CardContent>
//     </Card>
//   )
// }
