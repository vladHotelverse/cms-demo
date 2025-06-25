"use client"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import YearCalendar from "@/components/year-calendar"
import ExceptionsManager from "@/components/exceptions-manager"
import { useLanguage } from "@/contexts/language-context"

export default function CalendarPage() {
  const { t } = useLanguage()

  return (
    <div className="p-6 md:p-8 w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("calendarManagement")}</h1>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="calendar" className="flex-1">
            {t("yearCalendar")}
          </TabsTrigger>
          <TabsTrigger value="exceptions" className="flex-1">
            {t("exceptions")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="w-full">
          <Card className="border-none shadow-sm p-4 md:p-6 w-full">
            <YearCalendar />
          </Card>
        </TabsContent>

        <TabsContent value="exceptions" className="w-full">
          <Card className="border-none shadow-sm p-4 md:p-6 w-full">
            <ExceptionsManager />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
