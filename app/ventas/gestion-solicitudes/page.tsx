"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/shared/loading-spinner"

interface OrderRow {
  id: string
  locator: string
  name: string
  email: string
  checkIn: string
  nights: string
  roomType: string
  status: string
  extras: string
}

function formatStatus(status: string, t: (key: string) => string): string {
  const normalized = status.toLowerCase()
  if (normalized === "new") return t("statusNew")
  if (normalized === "pending") return t("statusPending")
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

function statusVariant(status: string): "default" | "secondary" | "outline" {
  const normalized = status.toLowerCase()
  if (normalized === "new") return "default"
  if (normalized === "pending") return "secondary"
  return "outline"
}

export default function GestionSolicitudesPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Failed to load orders:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const filtered = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(search.toLowerCase()) ||
      order.locator.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="w-full h-full">
      <AppHeader title={t("gestionSolicitudesVentas")} />
      <div className="p-6 md:p-8 space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md h-10"
            />

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table className="table-fixed w-full min-w-[720px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("locator")}</TableHead>
                      <TableHead>{t("guest")}</TableHead>
                      <TableHead>{t("roomType")}</TableHead>
                      <TableHead>{t("checkIn")}</TableHead>
                      <TableHead>{t("nights")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("extras")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {t("noReservationsFound")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.locator}</TableCell>
                          <TableCell>
                            <div>{order.name}</div>
                            <div className="text-xs text-muted-foreground">{order.email}</div>
                          </TableCell>
                          <TableCell>{order.roomType}</TableCell>
                          <TableCell>{order.checkIn}</TableCell>
                          <TableCell>{order.nights}</TableCell>
                          <TableCell>
                            <Badge variant={statusVariant(order.status)}>
                              {formatStatus(order.status, t)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{order.extras}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
