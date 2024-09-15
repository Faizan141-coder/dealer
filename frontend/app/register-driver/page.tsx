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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function SupplierRegistrationForm() {
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
  const [role, setRole] = useState("driver");
  const [truckNoPlate, setTruckNoPlate] = useState("");

  const router = useRouter();
  const { toast } = useToast();

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
            truck_plate_number: truckNoPlate,
            role,
          }),
        }
      );

      if (!email) {
        toast({
          title: "Email is required",
          variant: "destructive",
        });
        throw new Error("Email is required");
      }

      if (!password) {
        toast({
          title: "Password is required",
          variant: "destructive",
        });
        throw new Error("Password is required");
      }

      if (!username) {
        toast({
          title: "Username is required",
          variant: "destructive",
        });
        throw new Error("Username is required");
      }

      if (!firstName) {
        toast({
          title: "First name is required",
          variant: "destructive",
        });
        throw new Error("First name is required");
      }

      if (!lastName) {
        toast({
          title: "Last name is required",
          variant: "destructive",
        });
        throw new Error("Last name is required");
      }

      if (!phone) {
        toast({
          title: "Phone is required",
          variant: "destructive",
        });
        throw new Error("Phone is required");
      }

      if (!address) {
        toast({
          title: "Address is required",
          variant: "destructive",
        });
        throw new Error("Address is required");
      }

      if (!companyName) {
        toast({
          title: "Company name is required",
          variant: "destructive",
        });
        throw new Error("Company name is required");
      }

      if (!country) {
        toast({
          title: "Country is required",
          variant: "destructive",
        });
        throw new Error("Country is required");
      }

      if (!state) {
        toast({
          title: "State is required",
          variant: "destructive",
        });
        throw new Error("State is required");
      }

      if (!city) {
        toast({
          title: "City is required",
          variant: "destructive",
        });
        throw new Error("City is required");
      }

      if (!zip) {
        toast({
          title: "Zip is required",
          variant: "destructive",
        });
        throw new Error("Zip is required");
      }

      if (!truckNoPlate) {
        toast({
          title: "Price charged per ton is required",
          variant: "destructive",
        });
        throw new Error("Price charged per ton is required");
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
        toast({
          title: "User registered successfully",
          variant: "default",
        });
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
          <CardTitle className="text-xl">Register as Driver</CardTitle>
          <CardDescription>
            Enter your information to create driver account
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
                  value={email}
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
                  value={username}
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
                  value={firstName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
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
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  required
                  value={country}
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
                  type="number"
                  value={phone}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="XYZ Limited"
                  required
                  value={companyName}
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
                  value={address}
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
                  value={zip}
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
                  value={state}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  required
                  value={city}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="price-charged-per-ton">Truck Number Plate</Label>
              <Input
                id="price-charged-per-ton"
                onChange={(e) => setTruckNoPlate(e.target.value)}
                placeholder="New York"
                required
                value={truckNoPlate}
                type="number"
              />
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
