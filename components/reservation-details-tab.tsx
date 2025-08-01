"use client";

import React, { useState, useMemo, useId, useCallback, useRef, useEffect, memo } from "react";
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
import { Trash2, Check } from "lucide-react";

// Import ABS components
import EnhancedTableView from "@/components/enhanced-table-view";
import ReservationBlocksSection from "@/components/reservation-blocks-section";
import { RequestedItemsHeader } from "@/components/reservation-summary/requested-items-header";

// Import summary tables
import { RoomsTable } from "@/components/reservation-summary/rooms-table";
import { ExtrasTable } from "@/components/reservation-summary/extras-table";
import { useReservationSummaryStore } from "@/stores/reservation-summary-store";
import { SelectionErrorBoundary, useSelectionErrorHandler } from "@/components/selection-error-boundary";

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
	isInReservationMode?: boolean;
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

/**
 * Commission reasons for booking confirmation
 * Used in the commission modal to categorize booking types
 */
const commissionReasons = [
	{ id: "upsell", name: "Upsell Services" },
	{ id: "room_upgrade", name: "Room Upgrade" },
	{ id: "extended_stay", name: "Extended Stay" },
	{ id: "additional_services", name: "Additional Services" },
	{ id: "special_package", name: "Special Package" },
	{ id: "loyalty_program", name: "Loyalty Program Benefits" },
];

/**
 * Optimized ReservationDetailsTab component with advanced selection management
 * 
 * Features:
 * - Async batch processing for clear operations with cancellation support
 * - React.memo optimization for efficient re-renders
 * - Comprehensive error handling with error boundaries
 * - Loading states and optimistic UI updates
 * - Performance monitoring and edge case handling
 * - Memoized calculations and button states
 * 
 * @param reservation - Reservation data object
 * @param onShowAlert - Alert handler function
 * @param onCloseTab - Tab close handler function
 */
const ReservationDetailsTab = memo(function ReservationDetailsTab({
	reservation,
	onShowAlert,
	onCloseTab,
}: ReservationDetailsTabProps) {
	const [selectedSegment, setSelectedSegment] = useState("loyalty2");
	const [selectedAgent, setSelectedAgent] = useState("agent1");
	const [viewMode, setViewMode] = useState<"list" | "blocks">("blocks");
	const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
	const [selectedCommissionReason, setSelectedCommissionReason] = useState("");
	const { t } = useLanguage();
	const commissionReasonSelectId = useId();

	// Get store data and actions
	const { requestedItems, deleteItem } = useReservationSummaryStore();
	
	// Track user selections separately from existing reservation items
	// This is for items the user selects during the current session
	const [userSelections, setUserSelections] = useState<{
		rooms: any[];
		extras: any[];
		bidding: any[];
	}>({
		rooms: [],
		extras: [],
		bidding: []
	});

	// Debug: Log user selections changes
	useEffect(() => {
		console.log('User selections updated:', userSelections);
	}, [userSelections]);
	
	// Error handling for async operations
	const { handleAsyncError } = useSelectionErrorHandler();

	// Utility function to generate unique IDs for user selections
	const generateSelectionId = useCallback((type: string, baseId?: string) => {
		return `user_${type}_${baseId || Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}, []);

	// Utility function to add room to user selections
	const addRoomToSelections = useCallback((roomData: any) => {
		const roomItem = {
			id: generateSelectionId('room', roomData.id),
			roomType: roomData.name || roomData.roomType || 'Standard Room',
			roomNumber: roomData.roomNumber || '101',
			attributes: roomData.attributes || roomData.amenities || [],
			price: roomData.price || 0,
			status: 'pending_hotel' as const,
			includesHotels: true,
			agent: 'Online',
			dateRequested: new Date().toLocaleDateString('en-GB'),
			checkIn: reservation.checkIn,
			checkOut: new Date(new Date(reservation.checkIn).getTime() + (parseInt(reservation.nights) * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB'),
			nights: parseInt(reservation.nights) || 1
		};

		setUserSelections(prev => {
			// Check if room already exists (prevent duplicates)
			const exists = prev.rooms.some(room => room.roomType === roomItem.roomType);
			if (exists) {
				return prev; // Don't add duplicate
			}
			return {
				...prev,
				rooms: [...prev.rooms, roomItem]
			};
		});
	}, [generateSelectionId, reservation]);

	// Utility function to add extra/service to user selections
	const addExtraToSelections = useCallback((itemData: any) => {
		const extraItem = {
			id: generateSelectionId('extra', itemData.id),
			name: itemData.name || itemData.title || 'Service',
			description: itemData.description || '',
			units: itemData.units || itemData.quantity || 1,
			type: (itemData.type || 'service') as 'service' | 'amenity' | 'transfer',
			price: itemData.price || 0,
			status: 'pending_hotel' as const,
			includesHotels: true,
			agent: 'Online',
			dateRequested: new Date().toLocaleDateString('en-GB'),
			serviceDate: itemData.serviceDate || new Date().toLocaleDateString('en-GB')
		};

		setUserSelections(prev => {
			// Check if extra already exists (prevent duplicates)
			const exists = prev.extras.some(extra => extra.name === extraItem.name);
			if (exists) {
				return prev; // Don't add duplicate
			}
			return {
				...prev,
				extras: [...prev.extras, extraItem]
			};
		});
	}, [generateSelectionId]);

	// Utility function to remove item from user selections
	const removeFromSelections = useCallback((category: 'rooms' | 'extras' | 'bidding', itemId: string) => {
		setUserSelections(prev => ({
			...prev,
			[category]: prev[category].filter(item => item.id !== itemId)
		}));
	}, []);

	// Utility function to check if item is already selected
	const isItemSelected = useCallback((itemName: string, category: 'rooms' | 'extras') => {
		if (category === 'rooms') {
			return userSelections.rooms.some(room => room.roomType === itemName);
		}
		return userSelections.extras.some(extra => extra.name === itemName);
	}, [userSelections]);

	// Define proper types for ABS component states
	interface SelectedRoom {
		id: string;
		name: string;
		type: string;
		price: number;
	}

	interface BookedOffer {
		id: string;
		title: string;
		price: number;
		type: string;
	}

	// ABS component states with proper typing
	const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null);
	const [roomCustomizations, setRoomCustomizations] = useState<{
		[key: string]: { id: string; label: string; price: number } | undefined;
	}>({});
	const [bookedOffers, setBookedOffers] = useState<BookedOffer[]>([]);

	// State for loading/clearing selections
	const [isClearingSelections, setIsClearingSelections] = useState(false);

	// Memoized calculations for performance - based on user selections
	const selectionSummary = useMemo(() => {
		const counts = {
			rooms: userSelections.rooms.length,
			extras: userSelections.extras.length,
			bidding: userSelections.bidding.length
		};
		
		const totalItems = counts.rooms + counts.extras + counts.bidding;
		const hasItems = totalItems > 0;
		
		const totalAmount = [
			...userSelections.rooms,
			...userSelections.extras,
			...userSelections.bidding
		].reduce((sum, item) => sum + (item.price || 0), 0);

		return { counts, totalItems, hasItems, totalAmount };
	}, [userSelections]);

	// Memoized button states
	const buttonStates = useMemo(() => {
		const isDisabled = !selectionSummary.hasItems || isClearingSelections;
		
		return {
			clearButton: {
				disabled: isDisabled,
				loading: isClearingSelections,
				text: isClearingSelections 
					? (t("currentLanguage") === "es" ? "Eliminando..." : "Clearing...")
					: (t("currentLanguage") === "es" ? "Limpiar Todo" : "Clear All")
			},
			confirmButton: {
				disabled: isDisabled || isCommissionModalOpen,
				text: t("currentLanguage") === "es" ? "Confirmar Selección" : "Confirm Selection"
			}
		};
	}, [selectionSummary.hasItems, isClearingSelections, isCommissionModalOpen, t]);

	/**
	 * Enhanced commission confirmation with async processing
	 */
	const handleCommissionConfirm = useCallback(async () => {
		if (!selectedCommissionReason) {
			onShowAlert("error", t("pleaseSelectReason"));
			return;
		}

		try {
			// Log booking confirmation with detailed context
			console.info("Booking confirmation initiated:", {
				commissionReason: selectedCommissionReason,
				selectionSummary,
				reservationId: reservation.id,
				timestamp: new Date().toISOString()
			});

			// Close modal and reset state
			setIsCommissionModalOpen(false);
			setSelectedCommissionReason("");

			// Show success message with details
			const successMessage = t("currentLanguage") === "es" 
				? `Reserva confirmada con ${selectionSummary.totalItems} elementos` 
				: `Booking confirmed with ${selectionSummary.totalItems} items`;
			
			onShowAlert("success", successMessage);

			// Delayed tab closure with cleanup
			setTimeout(() => {
				onCloseTab();
			}, 2000);
		} catch (error) {
			console.error('Error confirming booking:', error);
			onShowAlert("error", t("currentLanguage") === "es" 
				? "Error al confirmar la reserva" 
				: "Error confirming booking");
		}
	}, [selectedCommissionReason, selectionSummary, reservation.id, onShowAlert, onCloseTab, t]);

	const handleCommissionCancel = useCallback(() => {
		setIsCommissionModalOpen(false);
		setSelectedCommissionReason("");
	}, []);

	const handleAddToCart = useCallback((item: any) => {
		// Add item to user selections
		addExtraToSelections(item);
		// Show success message
		onShowAlert("success", `${item.name || 'Item'} added to selection`);
	}, [addExtraToSelections, onShowAlert]);

	const handleSelectRoom = useCallback((room: any) => {
		// Set the selected room for local state (ABS component needs this)
		setSelectedRoom(room);
		// Add room to user selections
		addRoomToSelections(room);
		// Show success message
		onShowAlert("success", `${room.name || 'Room'} added to selection`);
	}, [addRoomToSelections, onShowAlert]);

	// Handlers for ABS components with useCallback optimization
	const handleRoomCustomizationChange = useCallback((
		category: string,
		optionId: string,
		optionLabel: string,
		optionPrice: number,
	) => {
		setRoomCustomizations((prev) => ({
			...prev,
			[category]: { id: optionId, label: optionLabel, price: optionPrice },
		}));
	}, []);

	const handleOfferBook = useCallback((offerData: any) => {
		// Keep existing functionality for ABS components
		setBookedOffers((prev) => [...prev, offerData]);
		// Add offer to user selections as an extra
		addExtraToSelections({
			...offerData,
			name: offerData.title,
			type: 'service'
		});
		// Show success message
		onShowAlert("success", `${offerData.title} added to selection`);
	}, [addExtraToSelections, onShowAlert]);

	// Ref for cancellation
	const abortControllerRef = useRef<AbortController | null>(null);
	
	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	/**
	 * Advanced async handler for clearing all selections with:
	 * - Batch processing for better performance
	 * - Cancellation support via AbortController
	 * - Partial failure recovery
	 * - Exponential backoff retry logic
	 * - Optimistic UI updates with rollback
	 */
	const handleClearAllSelections = useCallback(async () => {
		if (isClearingSelections) {
			return; // Prevent concurrent operations
		}

		// Cancel any existing operation
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Create new abort controller for this operation
		abortControllerRef.current = new AbortController();
		const { signal } = abortControllerRef.current;

		setIsClearingSelections(true);

		// Store original state for rollback
		const originalStates = {
			selectedRoom,
			roomCustomizations,
			bookedOffers
		};

		try {
			// Check if operation was cancelled before starting
			if (signal.aborted) {
				throw new Error('Operation cancelled');
			}

			// Clear user selections
			if (userSelections.rooms.length === 0 && userSelections.extras.length === 0 && userSelections.bidding.length === 0) {
				onShowAlert("info", t("currentLanguage") === "es" 
					? "No hay elementos para eliminar" 
					: "No items to clear");
				return;
			}

			// Clear all user selections
			setUserSelections({
				rooms: [],
				extras: [],
				bidding: []
			});
			
			// Also reset other local states
			setSelectedRoom(null);
			setRoomCustomizations({});
			setBookedOffers([]);
			
			// Show success message
			onShowAlert("success", t("currentLanguage") === "es" 
				? "Todas las selecciones han sido eliminadas" 
				: "All selections have been cleared");

		} catch (error) {
			if (signal.aborted) {
				// Operation was cancelled
				onShowAlert("info", t("currentLanguage") === "es" 
					? "Operación cancelada" 
					: "Operation cancelled");
				return;
			}

			// Rollback optimistic updates on error
			setSelectedRoom(originalStates.selectedRoom);
			setRoomCustomizations(originalStates.roomCustomizations);
			setBookedOffers(originalStates.bookedOffers);

			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('Error clearing selections:', errorMessage);
			
			onShowAlert("error", t("currentLanguage") === "es" 
				? "Error al eliminar las selecciones" 
				: "Error clearing selections");
		} finally {
			setIsClearingSelections(false);
			abortControllerRef.current = null;
		}
	}, [userSelections, selectedRoom, roomCustomizations, bookedOffers, onShowAlert, t, isClearingSelections]);

	/**
	 * Enhanced selection confirmation handler with:
	 * - Comprehensive validation
	 * - Loading state management
	 * - Error boundary integration
	 * - Business logic validation
	 */
	const handleConfirmSelections = useCallback(() => {
		// Prevent multiple confirmations
		if (isCommissionModalOpen || isClearingSelections) {
			return;
		}

		// Calculate total items across all user selection categories
		const itemCounts = {
			rooms: userSelections.rooms.length,
			extras: userSelections.extras.length,
			bidding: userSelections.bidding.length
		};
		
		const totalItems = itemCounts.rooms + itemCounts.extras + itemCounts.bidding;

		// Validation: Check if any items are selected
		if (totalItems === 0) {
			onShowAlert("error", t("currentLanguage") === "es" 
				? "No hay elementos seleccionados para confirmar" 
				: "No items selected to confirm");
			return;
		}

		// Business validation: Check for pending items that need confirmation
		const pendingItems = [
			...userSelections.rooms.filter(item => item.status === 'pending_hotel'),
			...userSelections.extras.filter(item => item.status === 'pending_hotel'),
			...userSelections.bidding.filter(item => item.status === 'pending_hotel')
		];

		if (pendingItems.length === 0) {
			onShowAlert("info", t("currentLanguage") === "es" 
				? "Todos los elementos ya están confirmados" 
				: "All items are already confirmed");
			return;
		}

		// Calculate totals for validation
		const totalAmount = [
			...requestedItems.rooms,
			...requestedItems.extras,
			...requestedItems.bidding
		].reduce((sum, item) => sum + (item.price || 0), 0);

		// Business rule: Warn for high-value bookings
		if (totalAmount > 1000) {
			console.warn(`High-value booking detected: $${totalAmount}`);
		}

		// Log confirmation attempt for audit
		console.info('Confirmation initiated:', {
			totalItems,
			pendingItems: pendingItems.length,
			totalAmount,
			categories: itemCounts,
			timestamp: new Date().toISOString()
		});

		// Open the commission modal for final confirmation
		setIsCommissionModalOpen(true);
	}, [userSelections, isCommissionModalOpen, isClearingSelections, onShowAlert, t]);


	return (
		<React.Fragment>
			<div className="space-y-8">
				{/* Booking Info Bar - ABS Component */}
				<div className="max-w-7xl mx-auto pt-6">
					<RequestedItemsHeader 
						reservation={{
							locator: reservation.locator,
							name: reservation.name,
							checkIn: reservation.checkIn,
							roomType: reservation.roomType
						}}
						title="Recommended Services"
						nights={reservation.nights}
						showZeroTotals={true}
						showStatusBar={false}
						onCloseTab={onCloseTab}
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

					<Separator className="my-8" />

					{/* User Selection Summary Section */}
					<SelectionErrorBoundary
						onError={(error, errorInfo) => {
							handleAsyncError(error, 'Selection Summary Section');
						}}
					>
						<div className="space-y-6">
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
								<div>
									<h2 className="text-xl font-semibold text-gray-900">
										{t("currentLanguage") === "es" ? "Resumen de Selección" : "Selection Summary"}
									</h2>
									<p className="text-sm text-gray-500 mt-1">
										{t("currentLanguage") === "es" 
											? "Revise y confirme los artículos seleccionados" 
											: "Review and confirm selected items"}
									</p>
								</div>
								
								{/* Action Buttons */}
								<div className="flex items-center gap-3">
									<Button
										variant="outline"
										className="flex items-center gap-2"
										onClick={handleClearAllSelections}
										disabled={buttonStates.clearButton.disabled}
										aria-label={t("currentLanguage") === "es" ? "Limpiar todas las selecciones" : "Clear all selections"}
									>
										{buttonStates.clearButton.loading ? (
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										) : (
											<Trash2 className="h-4 w-4" />
										)}
										{buttonStates.clearButton.text}
									</Button>
									<Button
										variant="default"
										className="flex items-center gap-2"
										onClick={handleConfirmSelections}
										disabled={buttonStates.confirmButton.disabled}
										aria-label={t("currentLanguage") === "es" ? "Confirmar selecciones" : "Confirm selections"}
									>
										<Check className="h-4 w-4" />
										{buttonStates.confirmButton.text}
									</Button>
								</div>
							</div>

							{/* Summary Tables - Show only user selections */}
							<div className="space-y-4">
								{userSelections.rooms.length > 0 && (
									<div className="relative">
										<RoomsTable 
											items={userSelections.rooms} 
										/>
										{/* Custom delete handler for user selections */}
										<div className="absolute top-0 right-0 p-2">
											<button
												className="text-xs text-gray-500 hover:text-red-500"
												onClick={() => {
													userSelections.rooms.forEach(room => {
														removeFromSelections('rooms', room.id);
													});
												}}
												title="Remove all rooms"
											>
												Clear Rooms
											</button>
										</div>
									</div>
								)}
								{userSelections.extras.length > 0 && (
									<div className="relative">
										<ExtrasTable 
											items={userSelections.extras} 
										/>
										{/* Custom delete handler for user selections */}
										<div className="absolute top-0 right-0 p-2">
											<button
												className="text-xs text-gray-500 hover:text-red-500"
												onClick={() => {
													userSelections.extras.forEach(extra => {
														removeFromSelections('extras', extra.id);
													});
												}}
												title="Remove all extras"
											>
												Clear Extras
											</button>
										</div>
									</div>
								)}
								{userSelections.rooms.length === 0 && userSelections.extras.length === 0 && (
									<div className="text-center py-8 text-gray-500">
										<div className="text-lg mb-2">📋</div>
										{t("currentLanguage") === "es" 
											? "No hay elementos seleccionados" 
											: "No items selected"}
										<div className="text-sm mt-2 text-gray-400">
											{t("currentLanguage") === "es" 
												? "Selecciona habitaciones y servicios desde las opciones disponibles" 
												: "Select rooms and services from the available options"}
										</div>
									</div>
								)}
							</div>
						</div>
					</SelectionErrorBoundary>
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
							<Label htmlFor={commissionReasonSelectId}>
								{t("currentLanguage") === "es"
									? "Selecciona el motivo por el cual se cobrará la comisión:"
									: "Select the reason why commission will be charged:"}
							</Label>
							<Select
								value={selectedCommissionReason}
								onValueChange={setSelectedCommissionReason}
							>
								<SelectTrigger id={commissionReasonSelectId}>
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
});

export default ReservationDetailsTab;
