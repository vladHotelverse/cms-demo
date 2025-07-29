"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/language-context";

// Import ABS components
import BookingInfoBar from "@/components/ABS_BookingInfoBar";
import EnhancedTableView from "@/components/enhanced-table-view";
import ReservationBlocksSection from "@/components/reservation-blocks-section";
import CompactReservationView from "@/components/compact-reservation-view";


// Import ABS translations
import { absTranslations } from "@/locales/abs-translations";

interface ReservationData {
	id: string;
	locator: string;
	name: string;
	email: string;
	checkIn: string;
	nights: string;
	roomType: string;
	aci: string;
	status: string;
	extras: string;
	hasHotelverseRequest: boolean;
}

interface ReservationDetailsTabProps {
	reservation: ReservationData;
	onShowAlert: (type: "success" | "error", message: string) => void;
	onCloseTab: () => void;
	isInReservationMode: boolean;
}


// Sample segments
const segments = [
	{ id: "loyalty1", name: "Loyalty 1 (5%)" },
	{ id: "loyalty2", name: "Loyalty 2 (10%)" },
	{ id: "loyalty3", name: "Loyalty 3 (15%)" },
	{ id: "vip1", name: "VIP 1 (20%)" },
	{ id: "vip2", name: "VIP 2 (25%)" },
	{ id: "vip3", name: "VIP 3 (100%)" },
];

// Sample agents
const agents = [
	{ id: "agent1", name: "Ana García" },
	{ id: "agent2", name: "Carlos López" },
	{ id: "agent3", name: "María Fernández" },
	{ id: "agent4", name: "Pedro Martínez" },
];

// Commission reasons
const commissionReasons = [
	{ id: "upsell", name: "Upsell Services" },
	{ id: "room_upgrade", name: "Room Upgrade" },
	{ id: "extended_stay", name: "Extended Stay" },
	{ id: "additional_services", name: "Additional Services" },
	{ id: "special_package", name: "Special Package" },
	{ id: "loyalty_program", name: "Loyalty Program Benefits" },
];

export default function ReservationDetailsTab({
	reservation,
	onShowAlert,
	onCloseTab,
	isInReservationMode,
}: ReservationDetailsTabProps) {
	const [selectedSegment, setSelectedSegment] = useState("loyalty2");
	const [selectedAgent, setSelectedAgent] = useState("agent1");
	const [viewMode, setViewMode] = useState<"list" | "blocks">("blocks");
	const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
	const [selectedCommissionReason, setSelectedCommissionReason] = useState("");
	const { t, currentLanguage } = useLanguage();

	// Helper function to get ABS translations
	const getABSTranslation = (key: string): string => {
		const lang = currentLanguage === "es" ? "es" : "en";
		return (absTranslations as any)[lang][key] || key;
	};

	// ABS component states
	const [selectedRoom, setSelectedRoom] = useState<any>(null);
	const [roomCustomizations, setRoomCustomizations] = useState<{
		[key: string]: { id: string; label: string; price: number } | undefined;
	}>({});
	const [bookedOffers, setBookedOffers] = useState<any[]>([]);

	const handleCommissionConfirm = () => {
		if (!selectedCommissionReason) {
			onShowAlert("error", t("pleaseSelectReason"));
			return;
		}

		console.log(
			"Booking confirmed with commission reason:",
			selectedCommissionReason,
		);

		setIsCommissionModalOpen(false);
		setSelectedCommissionReason("");

		onShowAlert("success", t("bookingConfirmedSuccessfully"));

		setTimeout(() => {
			onCloseTab();
		}, 2000);
	};

	const handleCommissionCancel = () => {
		setIsCommissionModalOpen(false);
		setSelectedCommissionReason("");
	};

	const handleAddToCart = (item: any) => {
		onShowAlert("success", `${item.name} added to cart`);
	};

	const handleSelectRoom = (room: any) => {
		setSelectedRoom(room);
		onShowAlert("success", `${room.name} selected`);
	};

	// Handlers for ABS components
	const handleRoomCustomizationChange = (
		category: string,
		optionId: string,
		optionLabel: string,
		optionPrice: number,
	) => {
		setRoomCustomizations((prev) => ({
			...prev,
			[category]: { id: optionId, label: optionLabel, price: optionPrice },
		}));
	};

	const handleOfferBook = (offerData: any) => {
		setBookedOffers((prev) => [...prev, offerData]);
		onShowAlert("success", `${offerData.title} booked successfully`);
	};


	return (
		<React.Fragment>
			<div className="space-y-8">
				{/* Booking Info Bar - ABS Component */}
				<div className="max-w-7xl mx-auto">
					<BookingInfoBar
						className="!container !max-w-none !mx-0"
						title={getABSTranslation("bookingInformation")}
						showBanner={false}
						items={[
							{
								icon: "Tag",
								label: getABSTranslation("bookingReference"),
								value: reservation.locator,
							},
							{
								icon: "Calendar",
								label: getABSTranslation("checkIn"),
								value: reservation.checkIn,
							},
							{
								icon: "Users",
								label: getABSTranslation("nights"),
								value: reservation.nights,
							},
							{
								icon: "Home",
								label: getABSTranslation("roomType"),
								value: reservation.roomType,
							},
						]}
					/>
				</div>

				<div className="max-w-7xl mx-auto space-y-6">
					{/* Top Section - Configuration and Reservation Info */}
					<div className="space-y-6">
						{/* Configuration Section */}
						<Card className="border-0 shadow-none">
							<CardHeader className="pb-4">
								<CardTitle className="text-lg font-semibold">
									{t("configuration")}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-6">
									{/* View Mode Toggle */}
									<div className="flex items-center gap-3">
										<Label className="text-sm font-medium text-gray-600 whitespace-nowrap">
											{t("viewAs")}
										</Label>
										<div className="flex items-center gap-1">
											<Button
												variant={viewMode === "list" ? "default" : "outline"}
												size="sm"
												onClick={() => setViewMode("list")}
												className="px-3"
											>
												{t("currentLanguage") === "es" ? "Lista" : "List"}
											</Button>
											<Button
												variant={viewMode === "blocks" ? "default" : "outline"}
												size="sm"
												onClick={() => setViewMode("blocks")}
												className="px-3"
											>
												{t("currentLanguage") === "es" ? "Bloques" : "Blocks"}
											</Button>
										</div>
									</div>

									{/* Segment Selector */}
									<div className="flex items-center gap-3">
										<Label className="text-sm font-medium text-gray-600 whitespace-nowrap">
											{t("currentLanguage") === "es" ? "Segmento:" : "Segment:"}
										</Label>
										<Select
											value={selectedSegment}
											onValueChange={setSelectedSegment}
										>
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{segments.map((segment) => (
													<SelectItem key={segment.id} value={segment.id}>
														{segment.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* Agent Selector */}
									<div className="flex items-center gap-3">
										<Label className="text-sm font-medium text-gray-600 whitespace-nowrap">
											{t("currentLanguage") === "es" ? "Agente:" : "Agent:"}
										</Label>
										<Select
											value={selectedAgent}
											onValueChange={setSelectedAgent}
										>
											<SelectTrigger className="w-40">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{agents.map((agent) => (
													<SelectItem key={agent.id} value={agent.id}>
														{agent.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<Separator className="my-8" />

					{/* Bottom Section - ABS Components Integration */}
					{viewMode === "list" ? (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Services Tables - List Mode */}
							<div className="space-y-6 lg:col-span-3">
								<EnhancedTableView
									onAddToCart={handleAddToCart}
									onSelectRoom={handleSelectRoom}
								/>
							</div>
						</div>
					) : (
						<div className="flex flex-row gap-6 overflow-hidden">
							{/* Blocks Mode - Original Layout with Horizontal Arrangement */}
							<ReservationBlocksSection
								selectedRoom={selectedRoom}
								roomCustomizations={roomCustomizations}
								bookedOffers={bookedOffers}
								onRoomSelected={handleSelectRoom}
								onRoomCustomizationChange={handleRoomCustomizationChange}
								nights={parseInt(reservation.nights) || 1}
								onOfferBook={handleOfferBook}
								onShowAlert={onShowAlert}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Commission Reason Modal */}
			<Dialog
				open={isCommissionModalOpen}
				onOpenChange={setIsCommissionModalOpen}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{t("currentLanguage") === "es"
								? "Motivo de la Comisión"
								: "Commission Reason"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="commission-reason">
								{t("currentLanguage") === "es"
									? "Selecciona el motivo por el cual se cobrará la comisión:"
									: "Select the reason why commission will be charged:"}
							</Label>
							<Select
								value={selectedCommissionReason}
								onValueChange={setSelectedCommissionReason}
							>
								<SelectTrigger id="commission-reason">
									<SelectValue
										placeholder={
											t("currentLanguage") === "es"
												? "Seleccionar motivo..."
												: "Select reason..."
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{commissionReasons.map((reason) => (
										<SelectItem key={reason.id} value={reason.id}>
											{reason.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={handleCommissionCancel}>
							{t("currentLanguage") === "es" ? "Cancelar" : "Cancel"}
						</Button>
						<Button
							onClick={handleCommissionConfirm}
							disabled={!selectedCommissionReason}
						>
							{t("currentLanguage") === "es" ? "Confirmar" : "Confirm"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
}
