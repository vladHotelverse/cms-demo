"use client"

import clsx from "clsx"
import type React from "react"
import "./styles.css"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface HeaderProps {
  className?: string
  totalPrice?: number
  currencySymbol?: string
  totalLabel?: string
  onCartClick?: () => void
  itemsInCart: number
  isLoading?: boolean
  isSticky?: boolean
}

const formatPrice = (price: number, symbol = "€") => {
  return `${symbol}${price.toFixed(2)}`
}

const Header: React.FC<HeaderProps> = ({
  className,
  totalPrice = 0,
  currencySymbol = "€",
  totalLabel = "Total:",
  onCartClick,
  itemsInCart,
  isLoading = false,
  isSticky = true,
}) => {
  // Format price using the currency utility
  const formattedPrice = formatPrice(totalPrice, currencySymbol)

  return (
    <header className={clsx("bg-black text-white shadow-md", isSticky && "sticky top-0 z-50", className)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Simple Hotelverse Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 bg-white text-black rounded-md font-bold text-xl">
              H
            </div>
            <div>
              <span className="font-semibold text-lg">Hotelverse</span>
            </div>
          </div>

          {/* Cart and Price */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-neutral-300">{totalLabel}</p>
              <p className="text-base font-medium">{formattedPrice}</p>
            </div>
            <Button
              onClick={onCartClick}
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={`Shopping cart with ${itemsInCart} items. Total: ${formattedPrice}`}
              disabled={isLoading}
            >
              <ShoppingCart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
