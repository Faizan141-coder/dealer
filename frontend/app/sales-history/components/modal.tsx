import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package2, Truck, DollarSign, MapPin, Calendar } from "lucide-react"

type SubProduct = {
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

type SubProductModalProps = {
  subProduct: SubProduct
  isOpen: boolean
  onClose: () => void
}

export function SubProductModal({ subProduct, isOpen, onClose }: SubProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{subProduct.sub_order_name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{subProduct.product_type}</Badge>
            <Badge variant="outline">
              <Calendar className="mr-1 h-3 w-3" />
              {new Date(subProduct.delivery_date).toLocaleDateString()}
            </Badge>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<Package2 className="h-4 w-4 text-blue-500" />}
              title="Quantity"
              value={`${subProduct.quantity} / ${subProduct.actual_quantity}`}
              subtitle="Ordered / Actual"
            />
            <InfoCard
              icon={<Truck className="h-4 w-4 text-green-500" />}
              title="Delivery"
              value={subProduct.truck_company}
              subtitle={`Driver: ${subProduct.truck_driver}`}
            />
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Delivery Details</h3>
            <div className="grid gap-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{subProduct.delivery_address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Miles Traveled:</span>
                <Badge variant="outline">{subProduct.miles_traveled} miles</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Financial Summary</h3>
            <div className="grid gap-2">
              <PriceItem label="Supplier Price" value={subProduct.price_charged_by_supplier} />
              <PriceItem label="Delivery Cost" value={subProduct.delivery_cost} />
              <PriceItem label="Sales Commission" value={subProduct.sales_commission} />
              <Separator className="my-2" />
              <PriceItem label="Listed Price" value={subProduct.price} isTotal />
              <PriceItem label="Actual Price" value={subProduct.actual_price} isTotal />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoCard({ icon, title, value, subtitle }: { icon: React.ReactNode; title: string; value: string; subtitle: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <h4 className="font-semibold">{title}</h4>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function PriceItem({ label, value, isTotal = false }: { label: string; value: number; isTotal?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${isTotal ? 'font-semibold' : ''}`}>{label}:</span>
      <Badge variant={isTotal ? "default" : "outline"} className={isTotal ? 'text-lg' : ''}>
        <DollarSign className="h-3 w-3 mr-1" />
        {value.toFixed(2)}
      </Badge>
    </div>
  )
}