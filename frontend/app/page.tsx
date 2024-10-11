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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    try {
      if (!email) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      // console.log("Response data:", data);

      if (response.ok) {
        toast({
          description: "Login successful",
          variant: "default",
        });
        const token = data.access;
        const role = data.role;

        Cookies.set("authToken", token, {
          expires: 7,
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        switch (role) {
          case "admin":
            router.push("/admin-dashboard");
            break;
          case "sales":
            router.push("/sales-dashboard");
            break;
          case "client":
            router.push("/place-order");
            break;
          case "trucker":
          case "truck":
            router.push("/trucker-dashboard");
            break;
          default:
            throw new Error("Unknown role");
        }
      } else {
        toast({
          description: data.message || "Login failed",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    // setModalVisible(true);
    router.push("/register");
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-pass"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <LoadingButton
              loading={loading}
              type="submit"
              className="w-full"
              onClick={handleLogin}
            >
              Login
            </LoadingButton>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <span
              onClick={handleSignupClick}
              className="underline cursor-pointer"
            >
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {/* {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Sign up as</h2>
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => router.push("/register")}
                className="w-full"
              >
                Client
              </Button>
              <Button
                onClick={() => router.push("/register-admin")}
                className="w-full"
              >
                Admin
              </Button>
              <Button
                onClick={() => router.push("/register-trucker")}
                className="w-full"
              >
                Trucker
              </Button>
              <Button
                onClick={() => router.push("/register-sales")}
                className="w-full"
              >
                Sales
              </Button>
              <Button onClick={handleCloseModal} className="w-full mt-2">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
