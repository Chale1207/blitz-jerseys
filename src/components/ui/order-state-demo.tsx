import { OrderState } from "@/components/ui/order-state"
import { Package, Truck, ShoppingCart, CheckCircle, Clock } from "lucide-react"

const demoStates = [
  {
    status: "Order Placed",
    icon: <ShoppingCart className="h-4 w-4" />,
    description: "Your order has been placed",
    isActive: true,
  },
  {
    status: "Processing",
    icon: <Clock className="h-4 w-4" />,
    description: "We're processing your order",
    isActive: true,
  },
  {
    status: "Packed",
    icon: <Package className="h-4 w-4" />,
    description: "Your order has been packed",
    isActive: false,
  },
  {
    status: "Shipped",
    icon: <Truck className="h-4 w-4" />,
    description: "Your order is on the way",
    isActive: false,
  },
  {
    status: "Delivered",
    icon: <CheckCircle className="h-4 w-4" />,
    description: "Your order has been delivered",
    isActive: false,
  },
]

function OrderStateDemo() {
  return (
    <div className="space-y-8">
      <div>
        <OrderState states={demoStates} />
      </div>
    </div>
  )
}

export { OrderStateDemo }
