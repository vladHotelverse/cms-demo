"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AttributeItem } from "./attribute-item"
import type { AttributeCategory as AttributeCategoryType } from "@/types/room"

interface AttributeCategoryProps {
  categoryName: string
  category: AttributeCategoryType
  selectedAttributes: Set<string>
  onToggleAttribute: (key: string) => void
}

export function AttributeCategory({
  categoryName,
  category,
  selectedAttributes,
  onToggleAttribute,
}: AttributeCategoryProps) {
  const Icon = category.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {categoryName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.items.map((item, index) => {
              const key = `${categoryName}-${index}`
              return (
                <AttributeItem
                  key={key}
                  item={item}
                  category={categoryName}
                  isSelected={selectedAttributes.has(key)}
                  onToggle={() => onToggleAttribute(key)}
                />
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}