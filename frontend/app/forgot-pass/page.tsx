"use client";

import Link from "next/link";

import { Button, LoadingButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handleForgotPass = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!email) {
        toast({
          variant: "destructive",
          description: "Email is required",
        });
      }

      console.log(response);  

      if (response.status === 200) {
        toast({
          variant: "default",
          description: "Password reset link sent to your email",
        });
        router.push(`/otp?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          variant: "destructive",
          description: "An error occurred",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email below to reset account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <LoadingButton loading={loading} onClick={handleForgotPass} className="w-full">
              Reset Password
            </LoadingButton>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
