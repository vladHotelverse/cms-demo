"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

interface ReservationSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  onViewMore: () => void
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

export function ReservationSummaryModal({
  isOpen,
  onClose,
  onViewMore,
  reservation,
}: ReservationSummaryModalProps) {
  const { t } = useLanguage()

  if (!isOpen) return null

  const hasItems = reservation.extras.includes(t("reserved"))
  const isRecommendation = !hasItems

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {t("locator")}: {reservation.locator}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {reservation.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {hasItems ? (
            // Already requested items view
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Ya solicitado</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Extras (X, Y, Z)</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                      Pending Hotel
                    </span>
                    <Button size="sm" variant="outline" className="text-xs h-6">
                      Cambiar estado
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Upsell (XYZ)</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      Confirmado
                    </span>
                    <Button size="sm" variant="outline" className="text-xs h-6">
                      Cambiar estado
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Atributos (X, Y, Z)</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                      Pending Hotel
                    </span>
                    <Button size="sm" variant="outline" className="text-xs h-6">
                      Cambiar estado
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span>TOTAL:</span>
                  <span>XXXX€</span>
                </div>
              </div>
              
              <Button className="w-full" size="lg">
                Gestionar
              </Button>
            </div>
          ) : (
            // Recommendations view
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Recomendados</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Upsell</span>
                  <Button size="sm" className="text-xs">
                    Ofrecer
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Extras (comisión base)</span>
                  <Button size="sm" className="text-xs">
                    Ofrecer
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Atributos</span>
                  <Button size="sm" className="text-xs">
                    Ofrecer
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={onViewMore}
            >
              Ver más...
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}