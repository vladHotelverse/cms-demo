"use client"

import { useState } from "react"
import { Save, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

type Exception = {
  id: string
  fromMonth: number // 0-11
  toMonth: number // 0-11
  name: string
  itemTypeId: string
}

export default function ExceptionsManager() {
  const { t } = useLanguage()
  
  // Sample item types
  const itemTypes = [
    { id: "1", name: t("cleaning"), color: "bg-blue-500" },
    { id: "2", name: t("maintenance"), color: "bg-amber-500" },
    { id: "3", name: t("inspection"), color: "bg-green-500" },
    { id: "4", name: t("specialEvent"), color: "bg-purple-500" },
    { id: "5", name: t("staffMeeting"), color: "bg-rose-500" },
  ]

  // Months of the year
  const months = [
    t("january"),
    t("february"),
    t("march"),
    t("april"),
    t("may"),
    t("june"),
    t("july"),
    t("august"),
    t("september"),
    t("october"),
    t("november"),
    t("december"),
  ]
  const [exceptions, setExceptions] = useState<Exception[]>([
    {
      id: "1",
      fromMonth: 4, // May
      toMonth: 8, // September
      name: "Summer Schedule",
      itemTypeId: "1",
    },
    {
      id: "2",
      fromMonth: 10, // November
      toMonth: 11, // December
      name: "Holiday Season",
      itemTypeId: "4",
    },
  ])

  const [fromMonth, setFromMonth] = useState<string>("")
  const [toMonth, setToMonth] = useState<string>("")
  const [exceptionName, setExceptionName] = useState("")
  const [itemTypeId, setItemTypeId] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  const handleAddException = () => {
    if (!fromMonth || !toMonth || !exceptionName || !itemTypeId) return

    // Validate that fromMonth is before or equal to toMonth
    if (Number(fromMonth) > Number(toMonth)) {
      toast({
        title: "Invalid date range",
        description: "From month must be before or equal to To month",
        variant: "destructive",
      })
      return
    }

    const newException: Exception = {
      id: Math.random().toString(36).substring(2, 9),
      fromMonth: Number(fromMonth),
      toMonth: Number(toMonth),
      name: exceptionName,
      itemTypeId,
    }

    setExceptions([...exceptions, newException])
    setFromMonth("")
    setToMonth("")
    setExceptionName("")
    setItemTypeId("")
    setHasChanges(true)

    toast({
      title: "Exception added",
      description: `Added exception "${exceptionName}" from ${months[Number(fromMonth)]} to ${months[Number(toMonth)]}`,
    })
  }

  const handleRemoveException = (id: string) => {
    setExceptions(exceptions.filter((exception) => exception.id !== id))
    setHasChanges(true)

    toast({
      title: "Exception removed",
      description: "Calendar exception has been removed",
    })
  }

  const handleSave = () => {
    // In a real app, you would save to a database here
    setHasChanges(false)

    toast({
      title: "Changes saved",
      description: "Your exceptions have been saved successfully",
    })
  }

  const handleCancel = () => {
    // In a real app, you would revert to the original data
    setHasChanges(false)

    toast({
      title: "Changes discarded",
      description: "Your exception changes have been reset",
    })
  }

  // Get color for an item type
  const getItemColor = (typeId: string) => {
    return itemTypes.find((t) => t.id === typeId)?.color || "bg-gray-500"
  }

  // Get name for an item type
  const getItemName = (typeId: string) => {
    return itemTypes.find((item) => item.id === typeId)?.name || t("unknown")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{t("calendarExceptions")}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={!hasChanges}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>
      </div>

      <Card className="p-4 border">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromMonth">From Month</Label>
            <Select value={fromMonth} onValueChange={setFromMonth}>
              <SelectTrigger id="fromMonth">
                <SelectValue placeholder="Select start month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={`from-${month}`} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toMonth">To Month</Label>
            <Select value={toMonth} onValueChange={setToMonth}>
              <SelectTrigger id="toMonth">
                <SelectValue placeholder="Select end month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={`to-${month}`} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exceptionName">Exception Name</Label>
            <Input
              id="exceptionName"
              value={exceptionName}
              onChange={(e) => setExceptionName(e.target.value)}
              placeholder="Name of exception"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemType">Applies To Item</Label>
            <Select value={itemTypeId} onValueChange={setItemTypeId}>
              <SelectTrigger id="itemType">
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="mt-4"
          onClick={handleAddException}
          disabled={!fromMonth || !toMonth || !exceptionName || !itemTypeId}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Exception
        </Button>
      </Card>

      <div className="border rounded-md">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Exception Name</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exceptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                    No exceptions added yet
                  </TableCell>
                </TableRow>
              ) : (
                exceptions.map((exception) => (
                  <TableRow key={exception.id}>
                    <TableCell>{months[exception.fromMonth]}</TableCell>
                    <TableCell>{months[exception.toMonth]}</TableCell>
                    <TableCell>{exception.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getItemColor(exception.itemTypeId)}`}></div>
                        <span>{getItemName(exception.itemTypeId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveException(exception.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}
