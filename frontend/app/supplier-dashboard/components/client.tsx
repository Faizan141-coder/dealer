"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, PlaceOrderColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface PlaceOrderClientProps {
  data: PlaceOrderColumn[];
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Supplier Dashboard"
          description={`Total (${data.length})`}
        />
      </div>
      <Separator />
      <DataTable searchKey="product_name" columns={columns} data={data} />
    </>
  );
};
