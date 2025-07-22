export interface Reservation {
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

export interface ReservationTab {
  id: string;
  reservation: Reservation;
}