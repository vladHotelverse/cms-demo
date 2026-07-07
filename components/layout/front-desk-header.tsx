"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface OpenTab {
	id: string;
	reservation: {
		name: string;
	};
}

interface FrontDeskHeaderProps {
	activeTab: string;
	onTabChange: (value: string) => void;
	openTabs: OpenTab[];
	onCloseTab: (tabId: string) => void;
	isInReservationMode: boolean;
	t: (key: string) => string;
	className?: string;
	agent?: {
		name: string;
		role: string;
		commission: number;
	};
}

export function FrontDeskHeader({
	activeTab,
	onTabChange,
	openTabs,
	onCloseTab,
	isInReservationMode,
	t,
	className,
	agent,
}: FrontDeskHeaderProps) {
	const router = useRouter();

	const handleTabChange = (value: string) => {
		if (value === "dashboard") {
			router.push("/ventas/sales-analytics");
			return;
		}
		if (value === "gestion-solicitudes") {
			router.push("/ventas/gestion-solicitudes");
			return;
		}
		onTabChange(value);
	};

	return (
		<div
			className={cn(
				"flex items-center justify-between border-b bg-background h-[61px] px-4",
				className,
			)}
		>
			<section className="container max-w-7xl mx-auto flex items-center justify-between h-full gap-2 min-w-0">
				<div className="flex items-center min-w-0 flex-1">
					<SidebarTrigger className="mr-2 shrink-0" />
					<Tabs value={activeTab} onValueChange={handleTabChange} className="min-w-0">
						<TabsList className="h-10 max-w-full overflow-x-auto justify-start">
							<TabsTrigger
								value="front-desk-upsell"
								disabled={isInReservationMode}
							>
								{t("frontDeskUpsell")}
							</TabsTrigger>
							<TabsTrigger value="dashboard" disabled={isInReservationMode}>
								{t("dashboard")}
							</TabsTrigger>
							<TabsTrigger value="gestion-solicitudes" disabled={isInReservationMode}>
								{t("gestionSolicitudes")}
							</TabsTrigger>

							{/* Dynamic reservation tabs */}
							{openTabs.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className="group relative"
								>
									<div className="flex items-center gap-2">
										<span className="truncate max-w-32">
											{tab.reservation.name}
										</span>
										<span
											onClick={(e) => {
												e.stopPropagation();
												onCloseTab(tab.id);
											}}
											role="button"
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													e.stopPropagation();
													onCloseTab(tab.id);
												}
											}}
											className="hover:bg-gray-200 rounded-full p-1 cursor-pointer"
										>
											<X className="h-3 w-3" />
										</span>
									</div>
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				{agent && (
					<div className="flex items-center gap-2 text-sm shrink-0">
						<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
							<span className="text-blue-600 font-semibold text-xs">
								{agent.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()}
							</span>
						</div>
						<div className="text-right hidden sm:block">
							<div className="font-medium">{agent.name}</div>
							<div className="text-xs text-muted-foreground">{agent.role}</div>
						</div>
						<div className="text-right">
							<div className="text-xs text-muted-foreground hidden sm:block">
								{t("commission")}:
							</div>
							<div className="font-semibold text-green-600 flex items-center gap-1">
								<div className="bg-green-100 p-1 rounded-full">
									<Coins className="h-3 w-3 text-green-600" />
								</div>
								€{agent.commission.toFixed(2)}
							</div>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
