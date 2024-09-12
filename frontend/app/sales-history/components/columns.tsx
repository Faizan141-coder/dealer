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
import toast from "react-hot-toast"
import { Separator } from "@/components/ui/separator"

type SubProduct = {
  sub_product_name: string
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

type Product = {
  product_id: number
  supplier_username: string
  sub_products: SubProduct[]
}

export default function FormalSalesDashboard({ initialData }: { initialData: Product[] }) {
  const [products] = useState<Product[]>(initialData)
  const [selectedSubProduct, setSelectedSubProduct] = useState<SubProduct | null>(null)

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const totalRevenue = products.reduce(
    (acc, product) =>
      acc +
      product.sub_products.reduce(
        (subAcc, subProduct) =>
          subAcc +
          (subProduct.actual_price -
            subProduct.price_charged_by_supplier -
            subProduct.delivery_cost -
            subProduct.sales_commission),
        0
      ),
    0
  )

  const totalSupplierExpense = products.reduce(
    (acc, product) =>
      acc +
      product.sub_products.reduce(
        (subAcc, subProduct) => subAcc + subProduct.price_charged_by_supplier,
        0
      ),
    0
  )

  const totalTruckExpense = products.reduce(
    (acc, product) =>
      acc +
      product.sub_products.reduce(
        (subAcc, subProduct) => subAcc + subProduct.delivery_cost,
        0
      ),
    0
  )

  const totalCommission = products.reduce(
    (acc, product) =>
      acc +
      product.sub_products.reduce(
        (subAcc, subProduct) => subAcc + subProduct.sales_commission,
        0
      ),
    0
  )

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-4">
        <Heading
          title="Sales Dashboard"
          description={`Total (${products.length})`}
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
          <CardTitle className="text-xl font-semibold">Product Overview</CardTitle>
          <CardDescription>Detailed view of all products and sub-products</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Sub-Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actual Quantity</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.flatMap((product) =>
                product.sub_products.map((subProduct, index) => (
                  <TableRow key={`${product.product_id}-${index}`}>
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>{product.supplier_username}</TableCell>
                    <TableCell>{subProduct.sub_product_name}</TableCell>
                    <TableCell>{subProduct.product_type}</TableCell>
                    <TableCell>{subProduct.quantity}</TableCell>
                    <TableCell>{subProduct.actual_quantity}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(subProduct.delivery_date).toLocaleDateString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{subProduct.truck_driver}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubProduct(subProduct)}
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

      {selectedSubProduct && (
        <SubProductModal
          subProduct={selectedSubProduct}
          isOpen={!!selectedSubProduct}
          onClose={() => setSelectedSubProduct(null)}
        />
      )}
    </div>
  )
}