"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Band {
  id: string
  name: string
  description: string
}

interface BandFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  band: Band | null
  onSave: (band: Partial<Band>) => void
}

export default function BandFormDialog({ open, onOpenChange, band, onSave }: BandFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Band>>({
    name: "",
    description: "",
  })

  // Reset form when band changes
  useEffect(() => {
    if (band) {
      setFormData({
        name: band.name,
        description: band.description,
      })
    } else {
      setFormData({
        name: "",
        description: "",
      })
    }
  }, [band, open])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{band ? "Edit Band" : "Add Band"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Band name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Band description"
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{band ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
