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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [role, setRole] = useState("client");

  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://dealer-backend-kz82.vercel.app/signup/`,
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
            company_name: companyName,
            country,
            state,
            city,
            zip,
            address,
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

      if (!address) {
        throw new Error("Address is required");
      }

      if (!companyName) {
        throw new Error("Company name is required");
      }

      if (!country) {
        throw new Error("Country is required");
      }

      if (!state) {
        throw new Error("State is required");
      }

      if (!city) {
        throw new Error("City is required");
      }

      if (!zip) {
        throw new Error("Zip is required");
      }

      console.log(
        email,
        password,
        username,
        firstName,
        lastName,
        phone,
        companyName,
        country,
        state,
        city,
        zip,
        address
      );

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        toast.success("User registered successfully");
        // const data = await response.json();
        router.push("/");
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
        <CardHeader className="items-center">
          <CardTitle className="text-xl">Register as User</CardTitle>
          <CardDescription>
            Enter your information to create user account
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="John Doe"
                  required
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
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  placeholder="••••••••"
                  required
                  type="password"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03482051674"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="XYZ Limited"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street 12, New York"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  type="number"
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="42809"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Texax"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
            </div>
            <Button
              disabled={loading}
              onClick={handleRegister}
              type="submit"
              variant="default"
              className="w-full"
            >
              Register
            </Button>
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
