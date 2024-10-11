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
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

function RegisterAForm() {
  const [loading, setLoading] = useState(false);
  const [uploadedPDFs, setUploadedPDFs] = useState<File[]>([]);
  const [pdfClicked, setPdfClicked] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    company_name: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip_code: "",
    role: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const data = {
      email: searchParams.get("email") || "",
      password: searchParams.get("password") || "",
      username: searchParams.get("username") || "",
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      phone: searchParams.get("phone") || "",
      company_name: searchParams.get("company_name") || "",
      address: searchParams.get("address") || "",
      country: searchParams.get("country") || "",
      state: searchParams.get("state") || "",
      city: searchParams.get("city") || "",
      zip_code: searchParams.get("zip_code") || "",
      role: searchParams.get("role") || "",
    };
    setRegistrationData(data);
  }, [searchParams]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).filter(
        (file) => !uploadedPDFs.some((f) => f.name === file.name)
      );
      setUploadedPDFs((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedPDFs((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handlePdfClick = () => {
    setPdfClicked(true);
  };

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/signup/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        toast({
          title: "User registered successfully",
          variant: "default",
        });
        router.push("/");
      }
    } catch (error: any) {
      console.error("Registration failed", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendPDFs = async () => {
    try {
      const formData = new FormData();
      uploadedPDFs.forEach((file, index) => {
        formData.append("pdfs", file);
      });

      // Add the username to the formData
      formData.append("username", registrationData.username);
      formData.append("email", registrationData.email);
      formData.append(
        "fullname",
        registrationData.firstName + " " + registrationData.lastName
      );
      formData.append("phone", registrationData.phone);
      formData.append("address", registrationData.address);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-pdfs-to-admin/`,
        {
          method: "POST",
          body: formData,
        }
      );
    } catch (error: any) {
      console.error("Failed to send PDFs", error);
      toast({
        title: "Failed to send PDFs",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isFormValid = pdfClicked && uploadedPDFs.length > 0;
  const isPDFsSent = uploadedPDFs.length > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center">
          <CardTitle className="text-xl">Complete Registration</CardTitle>
          <CardDescription>
            Enter additional information to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Add your new form fields here */}

            <div className="text-center mt-4">
              <p>Please Click on the link below to fill out the PDF</p>
              <Link
                href="/Buycem-Credit-Agreement-March-2024.pdf"
                target="_blank"
                className="text-blue-500 hover:underline"
                onClick={handlePdfClick}
              >
                Download PDF
              </Link>
            </div>

            <div className="w-full">
              <div className="flex flex-col items-center justify-center">
                <Label
                  htmlFor="pdfs"
                  className="mb-2 text-white block text-sm font-medium"
                >
                  Upload PDFs
                </Label>
                <div className="flex items-center justify-center space-x-2">
                  <Input
                    id="pdfs"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                  {/* <Button onClick={sendPDFs} disabled={!isPDFsSent}>Send PDFs</Button> */}
                </div>
                {/* {uploadedPDFs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-white mb-2">
                      Uploaded PDFs:
                    </h4>
                    <ul className="space-y-2">
                      {uploadedPDFs.map((file) => (
                        <li
                          key={file.name}
                          className="flex items-center justify-between bg-purple-500 bg-opacity-20 rounded-md p-2"
                        >
                          <span className="text-sm text-white">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(file.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )} */}
              </div>
            </div>
            <LoadingButton
              loading={loading}
              onClick={() => {
                sendPDFs();
                handleRegister();
              }}
              type="submit"
              variant="default"
              className="w-full"
              disabled={!isFormValid}
            >
              Register
            </LoadingButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterA() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterAForm />
      </Suspense>
    </div>
  );
}
