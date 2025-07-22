"use client"

import { useState } from "react"
import { ChevronDown, Star, X, Check, Package2, Sparkles, Settings2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import ReservationDetailsTab from "./reservation-details-tab"
import { cn } from "@/lib/utils"

interface ReservationSummaryModalProps {
  reservation: {
    id: string
    locator: string
    name: string
    email: string
    checkIn: string
    nights: string
    roomType: string
    aci: string
    status: string
    extras: string
    hasHotelverseRequest: boolean
  }
}

// Sample data for demo purposes
const requestedItemsData = {
  extras: [
    {
      id: "e1",
      name: "Early Check In",
      description: "Check-in desde las 12:00",
      price: 25,
      status: "pending_hotel",
      includesHotels: true
    },
    {
      id: "e2",
      name: "Late Checkout",
      description: "Check-out hasta las 14:00",
      price: 30,
      status: "confirmed",
      includesHotels: true
    },
    {
      id: "e3",
      name: "Cuna bebé",
      description: "Cuna para bebé con ropa de cama",
      price: 15,
      status: "pending_hotel",
      includesHotels: true
    }
  ],
  upsell: [
    {
      id: "u1",
      name: "Superior Room Upgrade",
      description: "Vista al mar, balcón privado",
      price: 355,
      status: "confirmed",
      includesHotels: true
    },
    {
      id: "u2",
      name: "Paquete Romántico",
      description: "Botella de cava, pétalos de rosa, desayuno en habitación",
      price: 95,
      status: "pending_hotel",
      includesHotels: false
    }
  ],
  atributos: [
    {
      id: "a1",
      name: "Habitación Tranquila",
      description: "Alejada de ascensores y zonas comunes",
      price: 0,
      status: "confirmed",
      includesHotels: true
    },
    {
      id: "a2",
      name: "Piso Alto",
      description: "Plantas 8-12 con mejores vistas",
      price: 45,
      status: "pending_hotel",
      includesHotels: true
    },
    {
      id: "a3",
      name: "Cerca del Spa",
      description: "Acceso directo a zona wellness",
      price: 35,
      status: "pending_hotel",
      includesHotels: true
    }
  ]
}

const statusConfig = {
  pending_hotel: {
    label: "Pending Hotel",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-400"
  },
  confirmed: {
    label: "Confirmado",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-400"
  }
}

const categoryConfig = {
  extras: {
    label: "Extras",
    icon: Package2,
  },
  upsell: {
    label: "Upsell",
    icon: Sparkles,
  },
  atributos: {
    label: "Atributos",
    icon: Settings2,
  }
}

export function ReservationSummaryModal({
  reservation,
}: ReservationSummaryModalProps) {
  const { t } = useLanguage()
  const [showDetailedView, setShowDetailedView] = useState(false)
  const hasItems = reservation.extras.includes(t("reserved"))

  const calculateCategoryTotal = (items: typeof requestedItemsData.extras) => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }

  const calculateGrandTotal = () => {
    const extrasTotal = calculateCategoryTotal(requestedItemsData.extras)
    const upsellTotal = calculateCategoryTotal(requestedItemsData.upsell)
    const atributosTotal = calculateCategoryTotal(requestedItemsData.atributos)
    return extrasTotal + upsellTotal + atributosTotal
  }

  // For "Ya solicitado" case - Enhanced UI
  if (hasItems) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Enhanced Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Resumen de Solicitudes</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground/70">Localizador:</span>
                    <span className="font-semibold text-foreground">{reservation.locator}</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span className="font-medium">{reservation.name}</span>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <span>{reservation.checkIn}</span>
                </div>
              </div>
              
              {/* Summary Cards */}
              <div className="flex gap-4">
                <Card className="px-4 py-3">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Pedido</p>
                    <p className="text-2xl font-bold">€{calculateGrandTotal()}</p>
                  </div>
                </Card>
                <Card className="px-4 py-3">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Comisión Est.</p>
                    <p className="text-xl font-bold text-emerald-600">€{(calculateGrandTotal() * 0.15).toFixed(2)}</p>
                  </div>
                </Card>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">
                  {Object.values(requestedItemsData).flat().filter(item => item.status === 'confirmed').length} Confirmados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-medium">
                  {Object.values(requestedItemsData).flat().filter(item => item.status === 'pending_hotel').length} Pendiente Hotel
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Package2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {Object.values(requestedItemsData).flat().length} servicios totales
                </span>
              </div>
            </div>
          </div>

          {/* Clean Table View inspired by the screenshot */}
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-muted/10 border-b border-border">
              <div className="grid grid-cols-10 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="col-span-1">Supplements</div>
                <div className="col-span-3">Room</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Dates</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
            </div>

            {/* Items grouped by type */}
            {Object.entries(requestedItemsData).map(([category, items]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig]
              const Icon = config.icon
              
              return (
                <div key={category}>
                  {/* Category Header */}
                  <div className="bg-muted/5 border-b border-border px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({items.length} item{items.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                  
                  {/* Category Items */}
                  {items.map((item) => {
                    const status = statusConfig[item.status as keyof typeof statusConfig]
                    
                    return (
                      <div 
                        key={item.id} 
                        className="grid grid-cols-10 gap-4 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/5 transition-colors items-center"
                      >
                        {/* Supplements (Price) */}
                        <div className="col-span-1">
                          <div className="font-semibold text-sm">
                            {item.price > 0 ? `${item.price},00 €` : '0,00 €'}
                          </div>
                        </div>

                        {/* Room (Service name) */}
                        <div className="col-span-3">
                          <div className="space-y-0.5">
                            <p className="font-medium text-sm text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground leading-tight">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Type */}
                        <div className="col-span-1">
                          <div className="flex items-center gap-1">
                            <Icon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">
                              {config.label}
                            </span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="col-span-2">
                          <div className="space-y-0.5">
                            <p className="text-sm">19/07/2025 - 23/07/2025</p>
                            <p className="text-xs text-muted-foreground">4 nights</p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <Badge 
                            className={cn("text-xs font-medium", status.color)}
                          >
                            <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", status.dotColor)} />
                            {status.label}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-center">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:bg-red-50"
                              title="Rechazar"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                            {item.status !== 'confirmed' && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-green-600 hover:bg-green-50"
                                title="Confirmar"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Enhanced Action Footer */}
          <div className="flex items-center justify-between p-6 bg-muted/20 rounded-lg border border-dashed">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Última actualización: hace 5 minutos
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button className="gap-2">
                <Settings2 className="h-4 w-4" />
                Gestionar pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For recommendations case - Simple view initially
  if (!showDetailedView) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-semibold">
                  Servicios Recomendados
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{t("locator")}: <span className="font-medium text-foreground">{reservation.locator}</span></span>
                  <span>•</span>
                  <span>{reservation.name}</span>
                  <span>•</span>
                  <span>{reservation.checkIn}</span>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                Recomendaciones
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recommendation cards */}
            <div className="grid gap-4">
              <Card className="border-2 border-dashed hover:border-solid transition-all hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Popular</Badge>
                        <h4 className="font-semibold">Room Upgrade - Suite Vista Mar</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Habitación más amplia con terraza privada y vistas panorámicas al mar
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">+€120/noche</span>
                        <span className="text-green-600">Comisión: €18</span>
                      </div>
                    </div>
                    <Button>
                      Ofrecer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed hover:border-solid transition-all hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Mejor valor</Badge>
                        <h4 className="font-semibold">Pack Comodidad Total</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Early check-in (12:00) + Late checkout (14:00) + Desayuno premium
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">€85 total</span>
                        <span className="text-green-600">Comisión: €12.75</span>
                      </div>
                    </div>
                    <Button>
                      Ofrecer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed hover:border-solid transition-all hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Premium</Badge>
                        <h4 className="font-semibold">Experiencia Wellness</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Acceso ilimitado al spa + Masaje 60min + Clase yoga privada
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">€150/persona</span>
                        <span className="text-green-600">Comisión: €22.50</span>
                      </div>
                    </div>
                    <Button>
                      Ofrecer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary footer */}
            <Card className="bg-muted/30 mt-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Potencial de comisión total</p>
                    <p className="text-2xl font-bold text-green-600">€53.25</p>
                  </div>
                  <Button 
                    onClick={() => setShowDetailedView(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    Ver catálogo completo
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Detailed view - Use ReservationDetailsTab
  return (
    <ReservationDetailsTab
      reservation={reservation}
      onShowAlert={() => {}}
      onCloseTab={() => {}}
      isInReservationMode={false}
    />
  )
}