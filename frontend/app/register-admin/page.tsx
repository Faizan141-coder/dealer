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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DealerRegistrationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("dealer");

  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/signup/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            username,
            first_name: firstName,
            last_name: lastName,
            phone,
            role,
          }),
        }
      );

      if (!email) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      if (!username) {
        throw new Error("Username is required");
      }

      if (!firstName) {
        throw new Error("First name is required");
      }

      if (!lastName) {
        throw new Error("Last name is required");
      }

      if (!phone) {
        throw new Error("Phone is required");
      }

      console.log(email, password, username, firstName, lastName, phone);

      // const data = await response.json();
      // console.log(data);

      if (response.status === 201) {
        toast.success("User registered successfully");
        // const data = await response.json();

        router.push("/");
      }
    } catch (error: any) {
      console.error("Invalid email or password", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center">
          <CardTitle className="text-xl">Register as Dealer</CardTitle>
          <CardDescription>
            Enter your information to create dealer account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="03482051674"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>
            </div>

            <LoadingButton
              loading={loading}
              onClick={handleRegister}
              type="submit"
              variant="default"
              className="w-full"
            >
              Register
            </LoadingButton>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
