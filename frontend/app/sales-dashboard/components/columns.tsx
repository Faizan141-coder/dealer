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
  sales_commission: number;
};

export type PlaceOrderColumn = {
  id: number;
  created_at: string;
  sub_orders: SubOrder[];
  dealer_username: string;
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
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
          {subOrders.map((subOrder, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={cn(
                "text-xs flex w-fit",
                subOrder.product_type === "type_1"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              )}
            >
                {subOrder.product_type === "type_1" ? "Type 1" : "Type 2"}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_orders",
    header: "Sales Commission",
    cell: ({ row }) => {
      const subOrders = row.getValue("sub_orders") as SubOrder[];
      return (
        <div className="space-y-1">
          {subOrders.map((subOrder, index) => (
            <span key={index} className="text-sm flex">
              {subOrder.sales_commission === 0
                ? "Not specified"
                : subOrder.sales_commission}
            </span>
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
                    "border-yellow-500 text-yellow-700",
                  subStatus.toLowerCase().includes("cancelled") &&
                    "border-red-500 text-red-700",
                  subStatus.toLowerCase().includes("confirmed") &&
                    "border-blue-500 text-blue-700",
                  subStatus.toLowerCase().includes("delivered") &&
                    "border-green-500 text-green-700"
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
