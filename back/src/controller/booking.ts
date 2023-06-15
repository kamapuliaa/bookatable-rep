import { GraphQLError } from "graphql";
import { Component } from "../component";
import { datetimeRange } from "../tools/date";
import { unwrapId } from "../tools/wrap_id";
import { Booking, User } from "../types/graphql";
import { Typedef } from "../types/typename";
import { OrderInput } from "../types/graphql";

export class BookingController {
  constructor(private component: Component) {

  }

  async createBooking(user: User, restaurantId: string, date_from: Date, date_to: Date | null | undefined, place: string, name: string, phone: string, preOrder?: OrderInput[] | null): Promise<Booking> {
    // Check if exist restaurant
    const restaurants = await this.component.restaurant.getRestaurants();
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    // Check if restaurant is open
    const dateTo = datetimeRange(date_from, date_to).intersect(restaurant.workingHours);
    if (!dateTo) {
      throw new Error("Restaurant is closed at this time");
    }
    // Check if user already have booking in same time
    const restaurantID = unwrapId(restaurantId, Typedef.RestaurantType);
    const bookings = await this.component.reservation.getBookings(restaurantID, place, date_from, date_to);
    if (bookings.length > 0) {
      throw new GraphQLError("This place is already booked", {
        path: ["createBooking", "place"]
      });
    }
    return await this.component.wrapper.createDbContext(async () => {
      const booking = await this.component.reservation.createBooking(restaurantID, unwrapId(user.id, Typedef.UserType), date_from, dateTo, place, name, phone);
      if (preOrder) {
        const bookingID = unwrapId(booking.id, Typedef.BookingType);
        await this.component.preOrder.createPreOrder(bookingID, preOrder);
      }
      return booking;
    });
  }

  async getActiveBookings(user: User): Promise<Booking[]> {
    if (user.restaurantId) {
      return await this.component.reservation.getRestaurantBookings(user.restaurantId);
    }
    const userID = unwrapId(user.id, Typedef.UserType);
    return await this.component.reservation.getActiveBookings(userID);
  }

  async getHistoryBookings(user: User): Promise<Booking[]> {
    const userID = unwrapId(user.id, Typedef.UserType);
    return await this.component.reservation.getHistoryBookings(userID);
  }

  async deleteBooking(user: User, bookingId: string): Promise<Booking> {
    const booking = await this.component.reservation.getBookingById(bookingId);
    if (!booking) {
      throw new Error("Booking not found: code: 42");
    }
    if (booking.userId !== user.id) {
      throw new Error("Booking not found, code: 43");
    }
    return await this.component.wrapper.createDbContext(async () => {
      await this.component.preOrder.deleteAllPreOrder(bookingId);
      await this.component.reservation.deleteBooking(bookingId);
      return booking;
    });
  }
}