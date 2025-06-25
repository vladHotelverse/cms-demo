"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CalendarBandAssignment } from "@/types/pricing"

interface Band {
  id: string
  name: string
  description: string
}

interface CalendarBandTableProps {
  bands: Band[]
  assignments: CalendarBandAssignment[]
  onUpdateAssignment: (month: number, dayOfWeek: number, bandId: string) => void
}

export default function CalendarBandTable({ bands, assignments, onUpdateAssignment }: CalendarBandTableProps) {
  // Months of the year
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Days of the week
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Get band assignment for a specific cell
  const getBandAssignment = (month: number, dayOfWeek: number) => {
    const assignment = assignments.find((a) => a.month === month && a.dayOfWeek === dayOfWeek)
    return assignment ? assignment.bandId : "none"
  }

  // Get band name by ID
  const getBandName = (bandId: string) => {
    const band = bands.find((b) => b.id === bandId)
    return band ? band.name : "None"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Calendar Band Assignment</h3>
        <p className="text-sm text-muted-foreground">Assign bands to specific days and months</p>
      </div>

      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[150px]">Month</TableHead>
              {daysOfWeek.map((day, index) => (
                <TableHead key={day}>{day}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {months.map((month, monthIndex) => (
              <TableRow key={month}>
                <TableCell className="font-medium">{month}</TableCell>
                {daysOfWeek.map((day, dayIndex) => {
                  // Convert to 0-6 where 0 is Sunday
                  const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1
                  const selectedBandId = getBandAssignment(monthIndex, dayOfWeek)

                  return (
                    <TableCell key={`${month}-${day}`} className="p-1">
                      <Select
                        value={selectedBandId}
                        onValueChange={(value) => onUpdateAssignment(monthIndex, dayOfWeek, value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select band" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {bands.map((band) => (
                            <SelectItem key={band.id} value={band.id}>
                              {band.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
