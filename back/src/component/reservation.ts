import { Service } from "../service";
import sql from "../tools/sql";
import { unwrapId, wrapId } from "../tools/wrap_id";
import { Typedef } from "../types/typename";
import { Booking } from "../types/graphql";

export type ReservationType = {
  id: number;
  restaurant_id: number;
  user_id: number;
  date_from: Date;
  date_to: Date;
  place: string;
  name: string;
  phone: string;
  comment: string;
}

const builder = sql.builder<ReservationType>('"reservation"', [
  "id", "restaurant_id", "user_id", "date_from", "date_to", "place", "name", "phone", "comment"
]);

export class ReservationComponent {
  constructor(private services: Service) {
  }

  decorate(rest: ReservationType): Booking {
    return {
      id: wrapId(rest.id, Typedef.BookingType),
      dateFrom: rest.date_from,
      dateTo: rest.date_to,
      place: rest.place,
      name: rest.name,
      phone: rest.phone,
      userId: wrapId(rest.user_id, Typedef.UserType),
      restaurantId: wrapId(rest.restaurant_id, Typedef.RestaurantType),
      __typename: 'Booking',
      comment: rest.comment
    }
  }

  async getBookings(restaurantId: number, place: string, date_from: Date, date_to: Date | null | undefined): Promise<Booking[]> {
    const res = await builder.selectAll().eq({ restaurant_id: restaurantId }).ge({ date_from, place });
    if (date_to) {
      res.le({ date_to });
    }
    const rows = await res.query(this.services);
    return rows.map(this.decorate);
  }

  async createBooking(restaurantId: number, userId: number, date_from: Date, date_to: Date, place: string, name: string, phone: string): Promise<Booking> {
    const rows = await builder.insert().fields([
      'name', 'phone', 'place', 'restaurant_id', 'user_id', 'date_from', 'date_to'
    ]).item([name, phone, place, restaurantId, userId, date_from, date_to]).query(this.services);
    return this.decorate(rows[0]);
  }

  async getActiveBookings(userId: number): Promise<Booking[]> {
    const res = await builder.selectAll().eq({ user_id: userId }).ge({ date_to: new Date() });
    const rows = await res.query(this.services);
    return rows.map(this.decorate);
  }

  async getRestaurantBookings(restaurant: string): Promise<Booking[]> {
    const res = await builder.selectAll().eq({ restaurant_id: unwrapId(restaurant, Typedef.RestaurantType) });
    const rows = await res.query(this.services);
    return rows.map(this.decorate);
  }

  async getHistoryBookings(userId: number): Promise<Booking[]> {
    const res = await builder.selectAll().eq({ user_id: userId }).lt({ date_to: new Date() });
    const rows = await res.query(this.services);
    return rows.map(this.decorate);
  }

  async getBookingById(id: string): Promise<Booking | undefined> {
    const rows = await builder.selectAll().eq({ id: unwrapId(id, Typedef.BookingType) }).limit(1).query(this.services);
    return rows[0] && this.decorate(rows[0]);
  }

  async deleteBooking(id: string): Promise<boolean> {
    const res = await builder.delete().eq({ id: unwrapId(id, Typedef.BookingType) }).query(this.services);
    return res;
  }
}