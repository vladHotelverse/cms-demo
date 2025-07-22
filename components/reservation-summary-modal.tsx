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
                  <div className="flex gap-4">
                    <div className="grid grid-rows-3 gap-2">
                      <div className="border border-gray-300 rounded p-1 text-center">
                        <div className="font-bold">€120</div>
                        <div className="text-xs text-muted-foreground uppercase">PER NIGHT</div>
                      </div>
                      <div className="border border-blue-400 bg-blue-100 rounded p-1 text-center">
                        <div className="font-bold">€120</div>
                        <div className="text-xs text-muted-foreground uppercase">TOTAL</div>
                      </div>
                      <div className="border border-green-400 bg-green-100 rounded p-1 text-center">
                        <div className="font-bold">€18</div>
                        <div className="text-xs text-muted-foreground uppercase">COMISIÓN</div>
                      </div>
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">Room Upgrade - Suite Vista Mar</h4>
                          <p className="text-base text-muted-foreground">
                            Habitación más amplia con terraza privada y vistas panorámicas al mar
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="flex-1 h-20 bg-gray-200 rounded overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=120&h=80&fit=crop&crop=center" alt="Luxury hotel room" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 h-20 bg-gray-200 rounded overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=120&h=80&fit=crop&crop=center" alt="Hotel terrace with sea view" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 h-20 bg-gray-200 rounded overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=120&h=80&fit=crop&crop=center" alt="Ocean view from hotel" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Pool View
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Balcony
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Best Views
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                        <Button size="sm">
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed hover:border-solid transition-all hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="grid grid-rows-3 gap-2">
                      <div className="border border-gray-300 rounded p-1 text-center">
                        <div className="font-bold">€42.5</div>
                        <div className="text-xs text-muted-foreground uppercase">PER NIGHT</div>
                      </div>
                      <div className="border border-blue-400 bg-blue-100 rounded p-1 text-center">
                        <div className="font-bold">€85</div>
                        <div className="text-xs text-muted-foreground uppercase">TOTAL</div>
                      </div>
                      <div className="border border-green-400 bg-green-100 rounded p-1 text-center">
                        <div className="font-bold">€12.75</div>
                        <div className="text-xs text-muted-foreground uppercase">COMISIÓN</div>
                      </div>
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Planta Alta</h4>
                        <p className="text-base text-muted-foreground">
                          Habitación en planta superior con vistas elevadas y mayor privacidad
                        </p>
                        <div className="text-sm text-muted-foreground">
                          • Ubicación en pisos 4-6 (vs 1-3 estándar)<br/>
                          • Vistas panorámicas sin obstrucciones<br/>
                          • Ambiente más tranquilo y exclusivo
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                        <Button size="sm">
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed hover:border-solid transition-all hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="grid grid-rows-3 gap-2">
                      <div className="border border-gray-300 rounded p-1 text-center">
                        <div className="font-bold">€150</div>
                        <div className="text-xs text-muted-foreground uppercase">PER PERSON</div>
                      </div>
                      <div className="border border-blue-400 bg-blue-100 rounded p-1 text-center">
                        <div className="font-bold">€150</div>
                        <div className="text-xs text-muted-foreground uppercase">TOTAL</div>
                      </div>
                      <div className="border border-green-400 bg-green-100 rounded p-1 text-center">
                        <div className="font-bold">€22.50</div>
                        <div className="text-xs text-muted-foreground uppercase">COMISIÓN</div>
                      </div>
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">Experiencia Wellness</h4>
                          <p className="text-base text-muted-foreground">
                            Acceso ilimitado al spa + Masaje 60min + Clase yoga privada
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="flex-1 h-20 bg-gray-200 rounded overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=80&fit=crop&crop=center" alt="Luxury spa treatment room" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 h-20 bg-gray-200 rounded overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=120&h=80&fit=crop&crop=center" alt="Relaxing massage therapy" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 h-20 bg-gray-200 rounded overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1506629905607-21d4b4b3c8e5?w=120&h=80&fit=crop&crop=center" alt="Private yoga session" className="w-full h-full object-cover" />
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          • Spa abierto 6:00-22:00<br/>
                          • Masaje relajante o deportivo a elegir<br/>
                          • Yoga privado con instructor certificado
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Decline
                        </Button>
                        <Button size="sm">
                          Accept
                        </Button>
                      </div>
                    </div>
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