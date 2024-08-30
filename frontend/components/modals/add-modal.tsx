"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  newQuestion: string;
  testType: string;
  setNewQuestion: React.Dispatch<React.SetStateAction<string>>;
  setTestType: React.Dispatch<React.SetStateAction<string>>;
}

export const AddModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  newQuestion,
  testType,
  setNewQuestion,
  setTestType,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Create Order"
      description="
        Create a new order by filling out the form below"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center space-x-4">
        <div className="w-full">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              value={newQuestion}
              className="focus:ring-black"
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here"
            />
          </div>
          <div className="mt-5">
            <select
              className="w-full px-3 py-2 border bg-white rounded-lg placeholder:text-gray-200 focus:outline-black border-gray-200"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
            >
              <option>Select Test Type</option>
              <option value="test1">Test 1</option>
              <option value="test2">Test 2</option>
            </select>
          </div>
        </div>
        <Button
          disabled={loading}
          className="bg-green-500 focus:ring-green-500 text-white"
          type="submit"
          size="sm"
          onClick={onConfirm}
        >
          <span className="sr-only">Send</span>
          <SendHorizontal color="#fff" className="h-4 w-4" />
        </Button>
      </div>
    </Modal>
  );
};
