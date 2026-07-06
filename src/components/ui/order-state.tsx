"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface OrderStateProps extends React.HTMLAttributes<HTMLUListElement> {
  states: {
    status: string
    icon: React.ReactNode
    description: string
    isActive: boolean
  }[]
}

const OrderState = React.forwardRef<HTMLUListElement, OrderStateProps>(
  ({ states, className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          "grid w-full grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
          className
        )}
        {...props}
      >
        {states.map((state) => (
          <li
            key={state.status}
            className={cn(
              "flex items-center gap-2 rounded-lg border p-1",
              state.isActive
                ? "bg-primary text-primary-foreground"
                : "border-border"
            )}
          >
            <span
              className={cn(
                "rounded-sm p-2",
                state.isActive
                  ? "bg-primary-foreground text-primary"
                  : "bg-foreground text-primary-foreground"
              )}
            >
              {state.icon}
            </span>
            <div>
              <p className="text-sm font-medium">{state.status}</p>
              <p
                className={cn(
                  "text-xs",
                  state.isActive
                    ? "text-primary-foreground/80"
                    : "text-foreground/80"
                )}
              >
                {state.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )
  }
)

OrderState.displayName = "OrderState"

export { OrderState }
