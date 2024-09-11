"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package2, Truck, DollarSign, Calendar, Percent } from "lucide-react";
import { SubProductModal } from "./modal";

type SubProduct = {
  sub_product_name: string;
  quantity: number;
  actual_quantity: number;
  product_type: string;
  delivery_address: string;
  delivery_date: string;
  truck_driver: string;
  truck_company: string;
  miles_traveled: number;
  delivery_cost: number;
  sales_commission: number;
  price_charged_by_supplier: number;
  price: number;
  actual_price: number;
};

type Product = {
  product_id: number;
  supplier_username: string;
  sub_products: SubProduct[];
};

export default function SalesDashboard({
  initialData,
}: {
  initialData: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialData);

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
  );

  const totalSupplierExpense = products.reduce(
    (acc, product) =>
      acc +
      product.sub_products.reduce(
        (subAcc, subProduct) => subAcc + subProduct.price_charged_by_supplier,
        0
      ),
    0
  );

  const totalTruckExpense = products.reduce(
    (acc, product) =>
      acc +
      product.sub_products.reduce(
        (subAcc, subProduct) => subAcc + subProduct.delivery_cost,
        0
      ),
    0
  );

  const totalCommission = products.reduce(
    (acc, product) =>
      acc +
      product.sub_products.reduce(
        (subAcc, subProduct) => subAcc + subProduct.sales_commission,
        0
      ),
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Total Supplier Expense */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supplier Expense</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSupplierExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Total Truck Expense */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Truck Expense</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTruckExpense.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Total Commission */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommission.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          {products.map((product) => (
            <TabsTrigger
              key={product.product_id}
              value={`product-${product.product_id}`}
            >
              Product {product.product_id}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <ScrollArea className="h-[600px] w-full rounded-md border">
            <div className="p-4">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>
        {products.map((product) => (
          <TabsContent
            key={product.product_id}
            value={`product-${product.product_id}`}
          >
            <ProductCard product={product} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [selectedSubProduct, setSelectedSubProduct] =
    useState<SubProduct | null>(null);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Product ID: {product.product_id}</CardTitle>
        <CardDescription>Supplier: {product.supplier_username}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {product.sub_products.map((subProduct, index) => (
              <Card key={index} className="w-[300px] flex-shrink-0">
                <CardHeader>
                  <CardTitle>{subProduct.sub_product_name}</CardTitle>
                  <CardDescription>
                    Type: {subProduct.product_type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <Badge>{subProduct.quantity}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Actual Quantity:</span>
                      <Badge variant="secondary">
                        {subProduct.actual_quantity}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Delivery Date:</span>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        {new Date(
                          subProduct.delivery_date
                        ).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Driver:</span>
                      <Badge variant="outline">{subProduct.truck_driver}</Badge>
                    </div>
                    <div className="mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedSubProduct(subProduct)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
      {selectedSubProduct && (
        <SubProductModal
          subProduct={selectedSubProduct}
          isOpen={!!selectedSubProduct}
          onClose={() => setSelectedSubProduct(null)}
        />
      )}
    </Card>
  );
}



