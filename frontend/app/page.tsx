"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!email) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      console.log("Email: ", email);
      console.log("Password: ", password);

      if (response.status === 200) {
        toast.success("Logged in successfully");
        const data = await response.json();
        const token = data.access;
        const role = data.role;

        // Cookies.set("userRole", data.role, {
        //   expires: 7,
        //   path: "/",
        //   secure: true,
        //   sameSite: "strict",
        // });

        // const expirationDate = new Date();
        // expirationDate.setSeconds(expirationDate.getSeconds() + 1);

        // const cookieExpiration = keepSignedIn ? 7 : undefined;

        Cookies.set("authToken", token, {
          expires: 7,
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        console.log("Token: ", token);
        console.log("Role: ", role);

        if (data.role === "dealer") {
          router.push("/dashboard");
        }
        if (data.role === "supplier") {
          router.push("/supplier-dashboard");
        }
        if (data.role === "client") {
          router.push("/place-order");
        }
      }
    } catch (error: any) {
      console.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
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
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Login
            </Button>
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
