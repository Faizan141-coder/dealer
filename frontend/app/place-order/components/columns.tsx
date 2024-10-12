import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type SubOrder = {
  product_name: string;
  product_type: string;
  quantity: number;
  delivery_date: string;
  sub_status: string;
  delivery_address: string;
  actual_price: number;
};

export type PlaceOrderColumn = {
  id: number;
  status: string;
  created_at: string;
  sub_orders: SubOrder[];
  dealer_username: string;
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       className="hover:bg-primary/10 transition duration-200"
  //     >
  //       Status
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as string;
  //     return (
  //       <Badge
  //         variant="outline"
  //         className={cn(
  //           "font-semibold",
  //           status.toLowerCase().includes("pending") &&
  //             "border-yellow-500 text-yellow-700",
  //           status.toLowerCase().includes("cancelled") &&
  //             "border-red-500 text-red-700",
  //           status.toLowerCase().includes("confirmed") &&
  //             "border-blue-500 text-blue-700",
  //           status.toLowerCase().includes("delivered") &&
  //             "border-green-500 text-green-700"
  //         )}
  //       >
  //         {status}
  //       </Badge>
  //     );
  //   },
  // },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("created_at") as string);
      return (
        <span className="text-muted-foreground">
          {createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Products",
    cell: ({ row }) => {
      const subOrders = row.original.sub_orders as SubOrder[];
      return (
        <div className="space-y-1">
          {subOrders.map((subOrder, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-all duration-200 ease-in-out">
                    <Package className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800 truncate max-w-[150px]">
                      {subOrder.product_name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white text-sm p-4 rounded-md shadow-lg">
                  <div>
                    <p>
                      <strong>Product Name:</strong> {subOrder.product_name}
                    </p>
                    <p>
                      <strong>Product Type:</strong> {subOrder.product_type}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {subOrder.quantity}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {new Date(subOrder.delivery_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Sub-Status:</strong> {subOrder.sub_status}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Type",
    cell: ({ row }) => {
      const subOrders = row.getValue("sub_orders") as SubOrder[];
      return (
        <div className="space-y-1">
          {subOrders.map((subOrder, index) => {
            const isBulk = subOrder.product_name === "bulk cement";
            return (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "text-xs flex w-fit",
                  isBulk ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                )}
              >
                {subOrder.product_type}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Actual Price",
    cell: ({ row }) => {
      const subOrders = row.getValue("sub_orders") as SubOrder[];
      return (
        <div className="space-y-2">
          {subOrders.map((subOrder, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-2 bg-gray-50 rounded-md shadow-sm"
            >
              {subOrder.actual_price === 0 ? (
                <span className="text-red-500 font-semibold">
                  Unpaid
                </span>
              ) : (
                <span className="font-semibold text-green-600">
                  {subOrder.actual_price} $
                </span>
              )}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Quantity",
    cell: ({ row }) => {
      const subOrders = row.getValue("sub_orders") as SubOrder[];
      return (
        <div className="space-y-1">
          {subOrders.map((subOrder, index) => (
            <span key={index} className="text-sm flex">
              {subOrder.quantity}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Delivery Address",
    cell: ({ row }) => {
      const subOrders = row.getValue("sub_orders") as SubOrder[];
      return (
        <div className="space-y-1 max-w-[150px]">
          {subOrders.map((subOrder, index) => (
            <span key={index} className="text-sm flex">
              {subOrder.delivery_address}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Delivery Date",
    cell: ({ row }) => {
      const subOrders = row.getValue("sub_orders") as SubOrder[];
      return (
        <div className="space-y-1">
          {subOrders.map((subOrder, index) => (
            <span key={index} className="text-sm text-muted-foreground flex">
              {subOrder.delivery_date}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Sub-Status",
    cell: ({ row }) => {
      const subOrders = row.getValue("sub_orders") as SubOrder[];
      return (
        <div className="space-y-1">
          {subOrders.map((subOrder, index) => {
            const subStatus = subOrder.sub_status;
            return (
              <Badge
                key={index}
                variant="outline"
                className={cn(
                  "text-xs font-medium flex w-fit",
                  subStatus.toLowerCase().includes("pending") &&
                    "border-yellow-500 text-yellow-700 hover:bg-yellow-300 hover:text-yellow-900",
                  subStatus.toLowerCase().includes("cancelled") &&
                    "border-red-500 text-red-700 hover:bg-red-300 hover:text-red-900",
                  subStatus.toLowerCase().includes("confirmed") &&
                    "border-blue-500 text-blue-700 hover:bg-blue-300 hover:text-blue-900",
                  subStatus.toLowerCase().includes("delivered") &&
                    "border-green-500 text-green-700 hover:bg-green-300 hover:text-green-900",
                  subStatus.toLowerCase().includes("assigned") &&
                    "border-purple-500 text-purple-700 hover:bg-purple-300 hover:text-purple-900",
                  subStatus.toLowerCase().includes("picked") &&
                    "border-orange-500 text-orange-700 hover:bg-orange-300 hover:text-orange-900"
                )}
              >
                {subStatus}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
];