"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { PlaceOrderColumn } from "./columns";


interface CellActionProps {
  data: PlaceOrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updateTest, setUpdateTest] = useState("");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="hover:bg-gray-200 text-green-500"
            onClick={() => {
              setUpdateModalOpen(true);
              setUpdatedTitle(data.title);
            }}
          >
            <Edit className="mr-2 h-4 w-4" color="green" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:bg-gray-200 text-red-500"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" color="red" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
