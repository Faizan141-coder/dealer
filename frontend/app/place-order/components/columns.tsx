"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type PlaceOrderColumn = {
  product_name: string;
  product_type: string;
  quantity: string;
  status: string;
};

export const columns: ColumnDef<PlaceOrderColumn>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-slate-100 transition duration-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "product_type",
    header: "Product Type",
    cell: ({ row }) => {
      const type = row.getValue("product_type") as string;

      return (
        <Badge
          className={cn(
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
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-slate-100 transition duration-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string; // Get the exact status from backend

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
              : "bg-gray-500 text-white" // Default color if none of the keywords match
          )}
        >
          {status} {/* Display the exact status text */}
        </Badge>
      );
    },
  },
  // add invoice button here
  // {
  //   accessorKey: "invoice",
  //   header: "Invoice",
  //   cell: ({ row }) => {
  //     return (
  //       <Button
  //         variant="outline"
  //         onClick={() => {
  //           // Add the logic to open the invoice modal here
  //         }}
  //       >
  //         Invoice
  //       </Button>
  //     );
  //   },
  // },
];
