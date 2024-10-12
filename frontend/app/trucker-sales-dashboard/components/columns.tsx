"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TruckIcon, PackageIcon, CalendarIcon, DollarSignIcon, MapPinIcon } from "lucide-react"
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from "@/components/ui/use-toast";

type SaleData = {
  sub_order__product_name: string
  sub_order__quantity: number
  sub_order__delivery_date: string
  sub_order__price_charged_by_truck: number
  sub_order__miles_traveled: number
  driver__driver_full_name: string
  driver__driver_phone_number: string
  driver__truck_plate_number: string
}

interface ComponentProps {
  data: SaleData[]
}

export default function Component({ data }: ComponentProps) {
  const [salesData, setSalesData] = useState<SaleData[]>([])
  const router = useRouter()
  const { toast } = useToast();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    toast({
      title: "Logged out successfully",
      variant: "default",
    });
    router.push("/");
  };

  useEffect(() => {
    setSalesData(data)
  }, [data])

  const totalSales = salesData.reduce((acc, sale) => acc + sale.sub_order__price_charged_by_truck, 0)
  const totalMiles = salesData.reduce((acc, sale) => acc + sale.sub_order__miles_traveled, 0)
  const totalQuantity = salesData.reduce((acc, sale) => acc + sale.sub_order__quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Truck Sales Dashboard"
          description={`Total (${data.length})`}
        />
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/trucker-dashboard")}>
            Truck Dashboard
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <Separator />    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Miles</CardTitle>
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMiles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Miles</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Truck Plate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell>{sale.sub_order__product_name}</TableCell>
                  <TableCell>{sale.sub_order__quantity}</TableCell>
                  <TableCell>{new Date(sale.sub_order__delivery_date).toLocaleDateString()}</TableCell>
                  <TableCell>${sale.sub_order__price_charged_by_truck.toFixed(2)}</TableCell>
                  <TableCell>{sale.sub_order__miles_traveled}</TableCell>
                  <TableCell>
                    <div>{sale.driver__driver_full_name}</div>
                    <div className="text-sm text-muted-foreground">{sale.driver__driver_phone_number}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sale.driver__truck_plate_number}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}