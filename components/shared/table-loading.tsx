import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableLoadingProps {
  rows?: number
  columns?: number
}

export function TableLoading({ rows = 5, columns = 8 }: TableLoadingProps) {
  return (
    <Table className="min-w-full text-xs">
      <TableHeader>
        <TableRow className="border-b-gray-200">
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index} className="px-2 py-2">
              <Skeleton className="h-4 w-16" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="border-t-gray-200">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex} className="px-2 py-2">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  {colIndex === 1 && <Skeleton className="h-2 w-3/4" />}
                  {colIndex === 5 && (
                    <div className="space-y-1">
                      <Skeleton className="h-6 w-full rounded border" />
                    </div>
                  )}
                  {colIndex === 6 && (
                    <div className="space-y-1">
                      <Skeleton className="h-6 w-full rounded border" />
                    </div>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}