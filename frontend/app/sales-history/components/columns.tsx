"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, LoadingButton } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package2, Truck, DollarSign, Calendar, Percent } from "lucide-react"
import { SubProductModal } from "./modal"
import { Heading } from "@/components/ui/heading"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast";

type SubOrder = {
  sub_order_name: string
  quantity: number
  actual_quantity: number
  product_type: string
  delivery_address: string
  delivery_date: string
  truck_driver: string
  truck_company: string
  miles_traveled: number
  delivery_cost: number
  sales_commission: number
  price_charged_by_supplier: number
  price: number
  actual_price: number
}

type Order = {
  order_id: number
  supplier_username: string
  sub_orders: SubOrder[]
}

export default function FormalSalesDashboard({ initialData }: { initialData: Order[] }) {
  const [orders] = useState<Order[]>(initialData)
  const [selectedSubOrder, setSelectedSubOrder] = useState<SubOrder | null>(null)
  const [loading, setLoading] = useState(false);

  const router = useRouter();
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

  const totalRevenue = orders.reduce(
    (acc, order) =>
      acc +
      order.sub_orders.reduce(
        (subAcc, subOrder) =>
          subAcc +
          (subOrder.actual_price -
            subOrder.price_charged_by_supplier -
            subOrder.delivery_cost -
            subOrder.sales_commission),
        0
      ),
    0
  )

  const totalSupplierExpense = orders.reduce(
    (acc, order) =>
      acc +
      order.sub_orders.reduce(
        (subAcc, subOrder) => subAcc + subOrder.price_charged_by_supplier,
        0
      ),
    0
  )

  const totalTruckExpense = orders.reduce(
    (acc, order) =>
      acc +
      order.sub_orders.reduce(
        (subAcc, subOrder) => subAcc + subOrder.delivery_cost,
        0
      ),
    0
  )

  const totalCommission = orders.reduce(
    (acc, order) =>
      acc +
      order.sub_orders.reduce(
        (subAcc, subOrder) => subAcc + subOrder.sales_commission,
        0
      ),
    0
  )

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-4">
        <Heading
          title="Admin Dashboard"
          description={`Total Sales: (${orders.length})`}
        />
        <div className="flex items-center gap-x-2">
          <Link href="/admin-dashboard">
            <LoadingButton loading={loading}>Go Back</LoadingButton>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <Separator />
      {/* <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sales Dashboard</h1> */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 mt-4">
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supplier Expense</CardTitle>
            <Package2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalSupplierExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Truck Expense</CardTitle>
            <Truck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalTruckExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <Percent className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalCommission.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order Overview</CardTitle>
          <CardDescription>Detailed view of all orders and sub-orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Sub-Order</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actual Quantity</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.flatMap((order) =>
                order.sub_orders.map((subOrder, index) => (
                  <TableRow key={`${order.order_id}-${index}`}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.supplier_username}</TableCell>
                    <TableCell>{subOrder.sub_order_name}</TableCell>
                    <TableCell>{subOrder.product_type}</TableCell>
                    <TableCell>{subOrder.quantity}</TableCell>
                    <TableCell>{subOrder.actual_quantity}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(subOrder.delivery_date).toLocaleDateString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subOrder.truck_driver}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubOrder(subOrder)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSubOrder && (
        <SubProductModal
          subProduct={selectedSubOrder}
          isOpen={!!selectedSubOrder}
          onClose={() => setSelectedSubOrder(null)}
        />
      )}
    </div>
  )
}
