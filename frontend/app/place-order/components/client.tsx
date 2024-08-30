"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, PlaceOrderColumn } from "./columns";
import { AddModal } from "@/components/modals/add-modal";
import { DataTable } from "@/components/ui/data-table";

interface PlaceOrderClientProps {
  data: PlaceOrderColumn[];
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {
  const [newQuestion, setNewQuestion] = useState(""); 
  const [testType, setTestType] = useState(""); 
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const onConfirm = async () => {
    setLoading(true);
    try {
     
    } catch (error: any) {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Place Order"
          description={`Total (${data.length})`}
        />
        <div>
          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-md hover:bg-gray-800"
          >
            <Plus size={16} className="inline mr-2" />
            Place Order
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
      <AddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={onConfirm}
        newQuestion={newQuestion}
        loading={loading}
        setNewQuestion={setNewQuestion}
        testType={testType}
        setTestType={setTestType}
      />
    </>
  );
};
