"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (weight: number) => void;
  loading: boolean;
  weights: React.Dispatch<React.SetStateAction<number>>;
}

export const ConfirmPickupModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  weights,
}: ConfirmPickupModalProps) => {
  const [weight, setWeight] = useState<number>(0);

  const handleConfirm = () => {
    onConfirm(weight); // Pass the weight back to the parent component
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Cement Weight"
      description="Please add the cement weight to proceed"
    >
      <div className="space-y-4">
        <Label>Actual Weight</Label>
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
          placeholder="Enter weight"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
