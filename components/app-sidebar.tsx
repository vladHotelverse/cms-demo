"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Home,
  FileText,
  Database,
  TrendingUp,
  BookOpen,
  Building2,
  MapIcon as MapLucideIcon,
  ClipboardList,
  ImageIcon,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Languages,
  Phone,
  Users,
  BarChart3,
  UserCheck,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface NavItem {
  titleKey: string
  icon: LucideIcon
  href?: string
  active?: boolean
  disabled?: boolean
  isLabel?: boolean
  children?: NavItem[]
  defaultOpen?: boolean
}

const menuItemsStructure: NavItem[] = [
  { titleKey: "inicio", icon: Home, href: "#", disabled: true },
  { titleKey: "admin", icon: FileText, href: "#", disabled: true },
  { titleKey: "maestros", icon: Database, href: "#", disabled: true },
  { titleKey: "confPreciosIniciales", icon: TrendingUp, href: "#", disabled: true },
  {
    titleKey: "ventas",
    icon: BookOpen,
    href: "#",
    disabled: false,
    defaultOpen: false,
    children: [
      { titleKey: "callCenter", icon: Phone, href: "/ventas/call-center", disabled: false },
      { titleKey: "frontDeskUpsell", icon: Users, href: "/ventas/front-desk-upsell", disabled: false },
      {
        titleKey: "gestionSolicitudesVentas",
        icon: ClipboardList,
        href: "/ventas/gestion-solicitudes",
        disabled: false,
      },
      { titleKey: "analiticaVentas", icon: BarChart3, href: "/ventas/analitica-ventas", disabled: false },
      { titleKey: "usuariosYComisiones", icon: UserCheck, href: "/ventas/usuarios-comisiones", disabled: false },
    ],
  },
  { titleKey: "hotelverseBeach", icon: Home, isLabel: true },
  {
    titleKey: "hotel",
    icon: Building2,
    href: "#",
    disabled: true,
    defaultOpen: false,
    children: [],
  },
  {
    titleKey: "mapa",
    icon: MapLucideIcon,
    href: "#",
    disabled: true,
    defaultOpen: false,
    children: [],
  },
  {
    titleKey: "gestion",
    icon: ClipboardList,
    href: "#",
    disabled: true,
    defaultOpen: false,
    children: [{ titleKey: "gestionSolicitudesGestion", icon: FileText, href: "#", disabled: true }],
  },
  {
    titleKey: "contenido",
    icon: ImageIcon,
    href: "#",
    disabled: false,
    defaultOpen: false,
    children: [
      { titleKey: "informacion", icon: FileText, href: "#", disabled: true },
      { titleKey: "hotelTitle", icon: FileText, href: "#", disabled: true },
      { titleKey: "instalaciones", icon: FileText, href: "#", disabled: true },
      { titleKey: "habitaciones", icon: FileText, href: "#", disabled: true },
      { titleKey: "atributos", icon: FileText, href: "/contenido/atributos" },
      { titleKey: "extrasContenido", icon: FileText, href: "/addons" },
      { titleKey: "experiencias", icon: FileText, href: "#", disabled: true },
      { titleKey: "recomendaciones", icon: FileText, href: "#", disabled: true },
    ],
  },
  {
    titleKey: "precios",
    icon: DollarSign,
    href: "#",
    disabled: false,
    defaultOpen: false,
    children: [
      { titleKey: "precioHabitacion", icon: FileText, href: "/calendar" },
      { titleKey: "upselling", icon: FileText, href: "#", disabled: true },
      { titleKey: "extrasPrecios", icon: FileText, href: "/addons-pricing" },
      { titleKey: "commissions", icon: FileText, href: "#", disabled: true },
      { titleKey: "discounts", icon: FileText, href: "#", disabled: true },
      { titleKey: "segmentos", icon: FileText, href: "/addons-bands" },
    ],
  },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { currentLanguage, toggleLanguage, t } = useLanguage()
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  // Initialize open states based on defaultOpen and active children
  useEffect(() => {
    const initialOpenStates: Record<string, boolean> = {}
    function checkActiveChildren(items: NavItem[], parentKey?: string) {
      items.forEach((item) => {
        const itemTitle = t(item.titleKey)
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) => child.href && pathname.startsWith(child.href) && child.href !== "#",
          )
          initialOpenStates[itemTitle] = item.defaultOpen || hasActiveChild
          checkActiveChildren(item.children, itemTitle)
        }
      })
    }
    checkActiveChildren(menuItemsStructure)
    setOpenStates(initialOpenStates)
  }, [pathname, t])

  const toggleCollapsible = (titleKey: string) => {
    const title = t(titleKey)
    setOpenStates((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const renderNavItems = (items: NavItem[], isSubmenu = false) => {
    return items.map((item) => {
      const translatedTitle = t(item.titleKey)

      if (item.isLabel) {
        return (
          <SidebarGroupLabel
            key={translatedTitle}
            className="px-2 pt-4 pb-2 text-xs font-semibold text-muted-foreground/70"
          >
            {translatedTitle}
          </SidebarGroupLabel>
        )
      }

      const isActive = item.href && item.href !== "#" && pathname === item.href
      const isParentActive = item.children?.some(
        (child) => child.href && pathname.startsWith(child.href) && child.href !== "#",
      )

      if (item.children && item.children.length > 0) {
        const isOpen = openStates[translatedTitle]
        return (
          <SidebarMenuItem key={translatedTitle} className="group/collapsible-item">
            <Collapsible open={isOpen} onOpenChange={() => toggleCollapsible(item.titleKey)}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  variant="ghost"
                  className={cn(
                    "w-full justify-between",
                    (isActive || isParentActive) && !item.disabled && "bg-muted font-medium",
                    item.disabled && "opacity-50 cursor-not-allowed",
                  )}
                  disabled={item.disabled}
                  isActive={isActive || isParentActive}
                  tooltip={translatedTitle}
                  onClick={(e) => {
                    if (item.disabled) e.preventDefault()
                  }}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{translatedTitle}</span>
                  </div>
                  {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>{renderNavItems(item.children, true)}</SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        )
      }

      const commonButtonProps = {
        asChild: !item.disabled,
        isActive: isActive,
        className: cn(
          item.disabled && "opacity-50 cursor-not-allowed",
          isActive && !item.disabled && "bg-muted font-medium",
        ),
        disabled: item.disabled,
        tooltip: translatedTitle,
      }

      const buttonContent = (
        <>
          <item.icon className="h-4 w-4" />
          <span>{translatedTitle}</span>
        </>
      )

      if (isSubmenu) {
        return (
          <SidebarMenuSubItem key={translatedTitle}>
            <SidebarMenuSubButton
              {...commonButtonProps}
              href={item.disabled ? undefined : item.href}
              onClick={(e) => {
                if (item.disabled && item.href === "#") e.preventDefault()
                if (item.disabled && item.href !== "#" && item.href !== undefined) e.preventDefault()
              }}
            >
              {item.disabled ? (
                <div className="flex items-center gap-2 w-full">{buttonContent}</div>
              ) : (
                <Link href={item.href || "#"} className="flex items-center gap-2 w-full">
                  {buttonContent}
                </Link>
              )}
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        )
      }

      return (
        <SidebarMenuItem key={translatedTitle}>
          <SidebarMenuButton
            {...commonButtonProps}
            href={item.disabled ? undefined : item.href}
            onClick={(e) => {
              if (item.disabled && item.href === "#") e.preventDefault()
              if (item.disabled && item.href !== "#" && item.href !== undefined) e.preventDefault()
            }}
          >
            {item.disabled ? (
              <div className="flex items-center gap-2 w-full">{buttonContent}</div>
            ) : (
              <Link href={item.href || "#"} className="flex items-center gap-2 w-full">
                {buttonContent}
              </Link>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })
  }

  const currentMenuItems = menuItemsStructure.map((item) => ({
    ...item,
    active: item.href && item.href !== "#" && pathname === item.href,
    children: item.children?.map((child) => ({
      ...child,
      active: child.href && child.href !== "#" && pathname === child.href,
    })),
  }))

  return (
    <Sidebar>
      <SidebarHeader className="border-b py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 bg-foreground text-background rounded-md font-bold text-xl">
            H
          </div>
          <div>
            <span className="font-semibold text-sm block">Hotelverse</span>
            <span className="text-xs text-muted-foreground block">CMS</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>{renderNavItems(currentMenuItems)}</SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={`Switch to ${currentLanguage === "es" ? "English" : "Spanish"}`}
          >
            <Languages className="h-4 w-4" />
            <span className="sr-only">Switch Language</span>
          </Button>
          <span className="text-xs font-medium">{currentLanguage.toUpperCase()}</span>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
