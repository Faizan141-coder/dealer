"use client";

import { useState, useRef, Suspense } from "react";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

function OTPPageContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dealer-backend-kz82.vercel.app/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: otp.join(""),
          password: newPassword,
        }),
      });

      if (response.status === 200) {
        toast({
          description: "Password reset successful",
          variant: "default",
        });
        router.push("/");
      } else {
        toast({
          description: "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp-0">One-Time Password</Label>
          <div className="flex gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-full text-center"
                required
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <LoadingButton
          onClick={handleSubmit}
          loading={loading}
          className="w-full"
        >
          Confirm
        </LoadingButton>
      </form>
    </Card>
  );
}

export default function OTPPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <OTPPageContent />
      </Suspense>
    </div>
  );
}
