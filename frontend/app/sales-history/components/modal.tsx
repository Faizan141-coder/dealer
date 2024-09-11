import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

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

type SubProductModalProps = {
  subProduct: SubProduct
  isOpen: boolean
  onClose: () => void
}

export function SubProductModal({ subProduct, isOpen, onClose }: SubProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subProduct.sub_product_name} Details</DialogTitle>
          <DialogDescription>Product Type: {subProduct.product_type}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Delivery Address:</span>
            <span>{subProduct.delivery_address}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Truck Company:</span>
            <span>{subProduct.truck_company}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Miles Traveled:</span>
            <Badge variant="secondary">{subProduct.miles_traveled}</Badge>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Delivery Cost:</span>
            <Badge variant="secondary">${subProduct.delivery_cost.toFixed(2)}</Badge>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Sales Commission:</span>
            <Badge variant="secondary">${subProduct.sales_commission.toFixed(2)}</Badge>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Sales Commission:</span>
            <Badge variant="secondary">${subProduct.price_charged_by_supplier.toFixed(2)}</Badge>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Price:</span>
            <Badge variant="secondary">${subProduct.price.toFixed(2)}</Badge>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-medium">Actual Price:</span>
            <Badge variant="secondary">${subProduct.actual_price.toFixed(2)}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}