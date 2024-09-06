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

export type SubProduct = {
  product_name: string;
  product_type: string;
  quantity: number;
  delivery_date: string;
  sub_status: string;
  delivery_address: string;
};

export type PlaceOrderColumn = {
  id: number;
  status: string;
  created_at: string;
  sub_products: SubProduct[];
  dealer_username: string;
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-primary/10 transition duration-200"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-semibold",
            status.toLowerCase().includes("pending") &&
              "border-yellow-500 text-yellow-700",
            status.toLowerCase().includes("cancelled") &&
              "border-red-500 text-red-700",
            status.toLowerCase().includes("confirmed") &&
              "border-blue-500 text-blue-700",
            status.toLowerCase().includes("delivered") &&
              "border-green-500 text-green-700"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
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
    accessorKey: "sub_products",
    header: "Products",
    cell: ({ row }) => {
      const subProducts = row.original.sub_products as SubProduct[];
      return (
        <div className="space-y-1">
          {subProducts.map((subProduct, index) => (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded-md transition-all duration-200 ease-in-out">
                    <Package className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800 truncate max-w-[150px]">
                      {subProduct.product_name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white text-sm p-4 rounded-md shadow-lg">
                  <div>
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
                      <strong>Delivery Date:</strong>{" "}
                      {new Date(subProduct.delivery_date).toLocaleDateString()}
                    </p>
                    {/* <p>
                      <strong>Delivery Address:</strong>{" "}
                      {subProduct.delivery_address}
                    </p> */}
                    <p>
                      <strong>Sub-Status:</strong> {subProduct.sub_status}
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
    accessorKey: "sub_products",
    header: "Type",
    cell: ({ row }) => {
      const subProducts = row.getValue("sub_products") as SubProduct[];
      return (
        <div className="space-y-1">
          {subProducts.map((subProduct, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={cn(
                "text-xs flex w-fit",
                subProduct.product_type === "type_1"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-pink-100 text-pink-800"
              )}
            >
              {subProduct.product_type === "type_1" ? "Type 1" : "Type 2"}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_products",
    header: "Quantity",
    cell: ({ row }) => {
      const subProducts = row.getValue("sub_products") as SubProduct[];
      return (
        <div className="space-y-1">
          {subProducts.map((subProduct, index) => (
            <span key={index} className="text-sm flex">
              {subProduct.quantity}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_products",
    header: "Delivery Address",
    cell: ({ row }) => {
      const subProducts = row.getValue("sub_products") as SubProduct[];
      return (
        <div className="space-y-1">
          {subProducts.map((subProduct, index) => (
            <span key={index} className="text-sm flex">
              {subProduct.delivery_address}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_products",
    header: "Delivery Date",
    cell: ({ row }) => {
      const subProducts = row.getValue("sub_products") as SubProduct[];
      return (
        <div className="space-y-1">
          {subProducts.map((subProduct, index) => (
            <span key={index} className="text-sm text-muted-foreground flex">
              {subProduct.delivery_date}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "sub_products",
    header: "Sub-Status",
    cell: ({ row }) => {
      const subProducts = row.getValue("sub_products") as SubProduct[];
      return (
        <div className="space-y-1">
          {subProducts.map((subProduct, index) => {
            const subStatus = subProduct.sub_status;
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
