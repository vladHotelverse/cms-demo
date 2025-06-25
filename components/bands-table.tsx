"use client"

import { useState } from "react"
import { Edit, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Band {
  id: string
  name: string
  description: string
}

interface BandsTableProps {
  bands: Band[]
  onEdit: (band: Band) => void
  onDelete: (id: string) => void
}

export default function BandsTable({ bands, onEdit, onDelete }: BandsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"name" | "description">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Filter bands based on search term
  const filteredBands = bands.filter(
    (band) =>
      band.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      band.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort bands based on sort field and direction
  const sortedBands = [...filteredBands].sort((a, b) => {
    const aValue = a[sortField].toLowerCase()
    const bValue = b[sortField].toLowerCase()

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  // Handle sort click
  const handleSort = (field: "name" | "description") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  return (
    <div>
      <div className="p-4 flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[300px]"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredBands.length} {filteredBands.length === 1 ? "band" : "bands"}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button variant="ghost" className="p-0 font-medium flex items-center" onClick={() => handleSort("name")}>
                Name
                {sortField === "name" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="p-0 font-medium flex items-center"
                onClick={() => handleSort("description")}
              >
                Description
                {sortField === "description" && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </Button>
            </TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No bands found. {searchTerm && "Try a different search term."}
              </TableCell>
            </TableRow>
          ) : (
            sortedBands.map((band) => (
              <TableRow key={band.id}>
                <TableCell className="font-medium">{band.name}</TableCell>
                <TableCell>{band.description}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <span className="sr-only">Open menu</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(band)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(band.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the band and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
