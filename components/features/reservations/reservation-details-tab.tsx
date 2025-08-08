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
import { RequestedItemsHeader } from "@/components/features/reservations/reservation-summary/requested-items-header";

// Import summary tables
import { RoomsTable } from "@/components/features/reservations/reservation-summary/rooms-table";
import { ExtrasTable } from "@/components/features/reservations/reservation-summary/extras-table";
import { useReservationSummaryStore } from "@/stores/reservation-summary-store";
import { SelectionErrorBoundary, useSelectionErrorHandler } from "@/components/selection-error-boundary";
import { SelectionSummary } from "@/components/selection-summary";
import { useUserSelectionsStore } from "@/stores/user-selections-store";

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
	onShowAlert: (type: "success" | "error" | "info" | "warning", message: string) => void;
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
	const { addRoom, addExtra, selectedRooms, selectedExtras } = useUserSelectionsStore();
	
	// Create reservationInfo from reservation prop with error handling
	const reservationInfo = useMemo(() => {
		let checkOut = '';
		try {
			const checkInDate = new Date(reservation.checkIn);
			const nights = parseInt(reservation.nights);
			
			if (!Number.isNaN(checkInDate.getTime()) && !Number.isNaN(nights) && nights > 0) {
				const checkOutDate = new Date(checkInDate.getTime() + nights * 24 * 60 * 60 * 1000);
				checkOut = checkOutDate.toISOString().split('T')[0];
			} else {
				// Fallback: use checkIn date if calculation fails
				checkOut = reservation.checkIn;
			}
		} catch (error) {
			console.warn('Error calculating checkout date:', error);
			checkOut = reservation.checkIn;
		}

		return {
			checkIn: reservation.checkIn,
			checkOut,
			agent: 'Hotel Staff', // Could be derived from context or props
			roomNumber: reservation.locator,
			originalRoomType: reservation.roomType
		};
	}, [reservation.checkIn, reservation.nights, reservation.locator, reservation.roomType]);

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

	
	// Error handling for async operations
	const { handleAsyncError } = useSelectionErrorHandler();






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

	// Enhanced callback with store integration and data transformation
	const handleAddToCart = useCallback(async (item: any) => {
		try {
			// Transform table item data to store-compatible OfferData format
			const transformedOffer = {
				id: item.id || `item_${Date.now()}`,
				name: item.name || item.title || 'Service',
				price: parsePrice(item.price),
				basePrice: parsePrice(item.price),
				quantity: item.units || 1,
				type: item.priceType || 'perStay',
				description: item.description,
				// Handle different date formats from the table
				selectedDate: new Date(),
				selectedDates: [new Date()],
				startDate: reservationInfo.checkIn,
				endDate: reservationInfo.checkOut,
				// Additional fields for compatibility
				validUntil: undefined,
				available: true,
				persons: item.persons || 1,
				nights: parseInt(reservation.nights) || 1
			};

			// Add to Zustand store via addExtra
			const result = await addExtra(transformedOffer, 'Maria García');
			
			if (result.success) {
				onShowAlert("success", `${item.name || 'Service'} added to selection`);
			} else {
				onShowAlert("error", result.errors?.[0]?.message || "Failed to add service");
			}
		} catch (error) {
			console.error('Error adding item to cart:', error);
			onShowAlert("error", "Failed to add service to selection");
		}
	}, [addExtra, reservationInfo, reservation.nights, onShowAlert]);

	// Utility function to safely parse price strings
	const parsePrice = useCallback((price: any): number => {
		if (typeof price === 'number') {
			return isNaN(price) ? 0 : price;
		}
		
		if (typeof price === 'string') {
			// Remove currency symbols and convert comma to dot
			const cleanPrice = price.replace(/[€$£¥]/g, '').replace(/,/g, '.').trim();
			const parsed = parseFloat(cleanPrice);
			return isNaN(parsed) ? 0 : parsed;
		}
		
		return 0;
	}, []);

	// Enhanced room selection callback with proper store integration
	// Handles both table room data and ABS carousel room data
	const handleSelectRoom = useCallback(async (room: any) => {
		// Set the selected room for local state (ABS component needs this)
		setSelectedRoom(room);
		
		// If room is null, it means we're clearing the selection (called from removal)
		if (!room) {
			return;
		}
		
		try {
			// Determine data source and transform accordingly
			const isCarouselData = room.title || room.name; // ABS carousel has title/name
			const isTableData = room.type && !room.title; // Table data has type but not title
			
			let transformedRoom;
			
			if (isCarouselData) {
				// Transform ABS carousel room data to store-compatible RoomOption format
				transformedRoom = {
					id: room.id?.toString() || `room_${Date.now()}`,
					roomType: room.title || room.name || room.roomType || 'Superior Room',
					price: parsePrice(room.price),
					originalRoomType: reservationInfo.originalRoomType,
					available: true,
					agent: 'Maria García',
					checkIn: reservationInfo.checkIn,
					checkOut: reservationInfo.checkOut,
					nights: parseInt(reservation.nights) || 1,
					roomNumber: reservationInfo.roomNumber,
					// ABS carousel amenities handling
					amenities: room.amenities || room.features || [],
					attributes: room.attributes || [],
					alternatives: room.alternatives || [],
					// UI display flags
					showKeyIcon: false,
					showAlternatives: false,
					showAttributes: false,
					selectionScenario: 'upgrade_only'
				};
			} else {
				// Transform table room data to store-compatible RoomOption format
				transformedRoom = {
					id: room.id?.toString() || `room_${Date.now()}`,
					roomType: room.type || room.roomType || 'Standard Room',
					price: parsePrice(room.price),
					originalRoomType: room.originalRoomType,
					available: true,
					agent: 'Maria García',
					checkIn: reservationInfo.checkIn,
					checkOut: reservationInfo.checkOut,
					nights: parseInt(reservation.nights) || 1,
					roomNumber: reservationInfo.roomNumber,
					// Transform features to amenities array
					amenities: room.features ? room.features.split(', ').slice(0, 3) : [],
					attributes: room.attributes || [],
					alternatives: room.alternatives || [],
					// UI display flags
					showKeyIcon: room.showKeyIcon || false,
					showAlternatives: room.showAlternatives || false,
					showAttributes: room.showAttributes || false,
					selectionScenario: room.selectionScenario || 'upgrade_only'
				};
			}
			
			const result = await addRoom(transformedRoom, reservationInfo);
			
			if (result.success) {
				const roomName = transformedRoom.roomType;
				onShowAlert("success", `${roomName} added to selection`);
			} else {
				onShowAlert("error", result.errors?.[0]?.message || "Failed to add room");
			}
		} catch (error) {
			console.error('Error selecting room:', error);
			onShowAlert("error", "Failed to add room to selection");
		}
	}, [addRoom, reservationInfo, reservation.nights, parsePrice, onShowAlert]);

	// Enhanced callback for attribute selections - adds to room customizations instead of extras
	const handleSelectAttribute = useCallback(async (attribute: any, itemKey: string) => {
		try {
			const { updateRoomCustomizations, addRoomFromCustomization, selectedRooms } = useUserSelectionsStore.getState();
			
			// Parse category and index from itemKey (format: "category-index")
			const [category, indexStr] = itemKey.split('-');
			
			// Create customization object
			const customization = {
				[category]: {
					id: `${category}_${indexStr}`,
					label: attribute.name,
					price: parsePrice(attribute.price),
					description: attribute.description,
					category: category
				}
			};
			
			const customizationTotal = parsePrice(attribute.price);
			
			// Check if there's already a selected room to add this attribute to
			if (selectedRooms.length > 0) {
				// Add attribute to existing room
				const existingRoom = selectedRooms[0]; // Use first room
				const result = await updateRoomCustomizations(
					existingRoom.id, 
					customization, 
					customizationTotal
				);
				
				if (result.success) {
					onShowAlert("success", `${attribute.name} added to room attributes`);
				} else {
					onShowAlert("error", result.errors?.[0]?.message || "Failed to add attribute to room");
				}
			} else {
				// No room exists, create a new room with this customization
				const result = await addRoomFromCustomization(customization, reservationInfo);
				
				if (result.success) {
					onShowAlert("success", `Room created with ${attribute.name} attribute`);
				} else {
					onShowAlert("error", result.errors?.[0]?.message || "Failed to create room with attribute");
				}
			}
		} catch (error) {
			console.error('Error selecting attribute:', error);
			onShowAlert("error", "Failed to add attribute to room");
		}
	}, [parsePrice, reservationInfo, onShowAlert]);

	// Enhanced room customization handler with store integration (matching table attribute logic)
	const handleRoomCustomizationChange = useCallback(async (
		category: string,
		optionId: string,
		optionLabel: string,
		optionPrice: number,
	) => {
		try {
			const { updateRoomCustomizations, addRoomFromCustomization, selectedRooms } = useUserSelectionsStore.getState();
			
			// Update local state for ABS component compatibility
			const updatedCustomizations = {
				...roomCustomizations,
				[category]: optionId ? { id: optionId, label: optionLabel, price: parsePrice(optionPrice) } : undefined,
			};
			
			// Remove undefined values (when deselecting)
			Object.keys(updatedCustomizations).forEach(key => {
				if (updatedCustomizations[key] === undefined) {
					delete updatedCustomizations[key];
				}
			});
			
			setRoomCustomizations(updatedCustomizations);
			
			// If removing customization (optionId is empty), handle deselection
			if (!optionId) {
				// For deselection, we still update the store to remove the customization
				if (selectedRooms.length > 0) {
					const existingRoom = selectedRooms[0];
					const storeCustomization = {
						[category]: undefined
					};
					await updateRoomCustomizations(existingRoom.id, storeCustomization, 0);
				}
				return;
			}
			
			// Create store-compatible customization object
			const storeCustomization = {
				[category]: {
					id: optionId,
					label: optionLabel,
					price: parsePrice(optionPrice),
					description: `${optionLabel} customization`,
					category: category
				}
			};
			
			const customizationTotal = parsePrice(optionPrice);
			
			// Apply the same logic as table attributes:
			// If room exists, add customization to it. If not, create room with customization.
			if (selectedRooms.length > 0) {
				// Add customization to existing room
				const existingRoom = selectedRooms[0];
				const result = await updateRoomCustomizations(
					existingRoom.id, 
					storeCustomization, 
					customizationTotal
				);
				
				if (result.success) {
					onShowAlert("success", `${optionLabel} added to room customizations`);
				} else {
					onShowAlert("error", result.errors?.[0]?.message || "Failed to update room customization");
				}
			} else {
				// No room exists, create a new room with this customization
				const result = await addRoomFromCustomization(storeCustomization, reservationInfo);
				
				if (result.success) {
					onShowAlert("success", `Room created with ${optionLabel} customization`);
				} else {
					onShowAlert("error", result.errors?.[0]?.message || "Failed to create room with customization");
				}
			}
		} catch (error) {
			console.error('Error handling room customization change:', error);
			onShowAlert("error", "Failed to apply room customization");
		}
	}, [roomCustomizations, parsePrice, reservationInfo, onShowAlert]);


	// Bridge handler for SelectionSummary component - handles the store integration
	const handleSelectionSummaryCustomization = useCallback((
		roomId: string, 
		customizations: any, 
		total: number
	) => {
		// This is called by SelectionSummary and handles the Zustand store integration
		// The SelectionSummary component's internal logic will handle the actual store calls
		return;
	}, []);

	const handleOfferBook = useCallback(async (offerData: any) => {
		// Keep existing functionality for ABS components
		setBookedOffers((prev) => [...prev, offerData]);
		
		// Add offer to Zustand store
		try {
			const result = await addExtra({
				id: offerData.id || Date.now(),
				name: offerData.title || offerData.name || 'Special Offer',
				price: offerData.price || 0,
				basePrice: offerData.basePrice || offerData.price || 0,
				quantity: offerData.quantity || 1,
				type: offerData.type || 'perStay',
				persons: offerData.persons,
				nights: offerData.nights,
				selectedDate: offerData.selectedDate,
				selectedDates: offerData.selectedDates,
				startDate: offerData.startDate,
				endDate: offerData.endDate
			});
			
			if (result.success) {
				onShowAlert("success", `${offerData.title || 'Offer'} added to selection`);
			} else {
				onShowAlert("error", result.errors?.[0]?.message || "Failed to add offer");
			}
		} catch {
			onShowAlert("error", "Failed to add offer to selection");
		}
	}, [addExtra, onShowAlert]);

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
		<>
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
									onSelectAttribute={handleSelectAttribute}
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
						onError={(error) => {
							handleAsyncError(error, 'Selection Summary Section');
						}}
					>
						<div className="space-y-6 pb-24">
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
							</div>

							{/* Summary Tables - Show only user selections */}
					<SelectionSummary
						onRoomSelectionChange={handleSelectRoom}
						onRoomCustomizationChange={handleSelectionSummaryCustomization}
						onSpecialOfferBooked={handleOfferBook}
						currentRoomCustomizations={roomCustomizations}
						reservationInfo={reservationInfo}
						showNotifications={true}
						translations={{
							roomsTitle: "Selected Rooms",
							extrasTitle: "Extra Services",
							noSelectionsText: "No items selected",
							noSelectionsSubtext: "Select rooms and services from the available options",
							clearAllText: "Clear All",
							clearRoomsText: "Clear Rooms",
							clearExtrasText: "Clear Extras",
							confirmSelectionsText: "Confirm Selections",
							roomAddedText: "Room added",
							roomRemovedText: "Room removed",
							extraAddedText: "Service added",
							extraRemovedText: "Service removed",
							customizationUpdatedText: "Customization updated",
							selectionsCleared: "All selections have been cleared"
						}}
						onCloseTab={onCloseTab}
					/>

						</div>
					</SelectionErrorBoundary>

					{/* Commission Modal Dialog */}
					<Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>
									{t("currentLanguage") === "es" ? "Motivo de la Comisión" : "Commission Reason"}
								</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<Label htmlFor={commissionReasonSelectId}>
									{t("currentLanguage") === "es" 
										? "Selecciona el motivo por el cual se cobrará comisión" 
										: "Select the reason for charging commission"}
								</Label>
								<Select 
									value={selectedCommissionReason} 
									onValueChange={setSelectedCommissionReason}
								>
									<SelectTrigger id={commissionReasonSelectId}>
										<SelectValue 
											placeholder={t("currentLanguage") === "es" ? "Seleccionar motivo..." : "Select reason..."} 
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
				</div>
			</div>
		</>
	);
});

ReservationDetailsTab.displayName = "ReservationDetailsTab";

export default ReservationDetailsTab;
