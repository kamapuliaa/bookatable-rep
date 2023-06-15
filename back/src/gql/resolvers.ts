import { Resolvers, Maybe, User } from "../types/graphql";
import { DateTimeResolver, TimeResolver } from 'graphql-scalars';
import { Controller } from "../controller";
import { RestaurantFilter } from "../controller/Restaurant";

export async function getResolvers(controller: Controller): Promise<Resolvers> {
  return {
    AccountQuery: {
      me: async (_, __, { me }): Promise<Maybe<User>> => {
        return me;
      }
    },
    AuthMutation: {
      async login(_, { email, password }) {
        const user = await controller.user.login(email, password);
        return user;
      },
      async logout(_, __, { me }) {
        if (!me) {
          throw new Error("Not authenticated");
        }
        const user = await controller.user.logout(me);
        return user;
      },
      async signup(_, { email, password, name, phone }) {
        const user = await controller.user.signup(email, password, name, phone);
        return user;
      }
    },
    BookingMutation: {
      createBooking: async (_, { restaurantId, date_time_from, date_time_to, place, name, phone, preOrder }, { me }) => {
        if (!me) {
          throw new Error("Not authenticated");
        }
        if (typeof restaurantId !== 'string') {
          throw new Error("restaurantId must be string");
        }
        const booking = await controller.booking.createBooking(me, restaurantId, date_time_from, date_time_to, place, name || me.name, phone || me.phone, preOrder);
        return booking;
      },
      async deleteBooking(_, { id }, { me }) {
        if (!me) {
          throw new Error("Not authenticated");
        }
        if (typeof id !== 'string') {
          throw new Error("id must be string");
        }
        const booking = await controller.booking.deleteBooking(me, id);
        return booking;
      }
    },
    BookingQuery: {
      async activeBookings(_, __, { me }) {
        if (!me) {
          throw new Error("Not authenticated");
        }
        const bookings = await controller.booking.getActiveBookings(me);
        return bookings;
      },
      async historyBookings(_, __, { me }) {
        if (!me) {
          throw new Error("Not authenticated");
        }
        const bookings = await controller.booking.getHistoryBookings(me);
        return bookings;
      }
    },
    Query: {
      account: () => ({
        __typename: 'AccountQuery'
      }),
      booking: () => ({
        __typename: 'BookingQuery'
      }),
      restaurant: () => ({
        __typename: 'RestaurantQuery'
      })
    },
    Mutation: {
      auth: () => ({
        __typename: 'AuthMutation',
      }),
      booking: () => ({
        __typename: 'BookingMutation'
      }),
      me: () => ({
        __typename: 'MeMutation'
      }),
      dish: () => ({
        __typename: 'DishMutation'
      }),
    },
    RestaurantQuery: {
      async restaurants() {
        const restaurants = await controller.restaurant.getRestaurants({});
        return restaurants;
      },
      async restaurant(_, { id }) {
        if (typeof id !== 'string') {
          throw new Error("id must be string");
        }
        const restaurant = await controller.restaurant.getRestaurant(id);
        return restaurant;
      }
    },
    DateTime: DateTimeResolver,
    Time: TimeResolver,
    Restaurant: {
      async dishes(restaurant) {
        const menu = await controller.dish.getDishes(restaurant.id);
        return menu;
      },
      async positions(restaurant) {
        const positions = await controller.position.getPositions(restaurant.id);
        return positions;
      },
      photos(restaurant) {
        return controller.restaurant.getPhotos(restaurant.id);
      },
      filters(restaurant) {
        return controller.restaurant.getTags(restaurant.id, 'filters');
      },
      cuisines(restaurant) {
        return controller.restaurant.getTags(restaurant.id, 'cuisines');
      }
    },
    Booking: {
      async preOrder(booking) {
        const orders = await controller.preOrder.getPreOrder(booking.id);
        return orders;
      },
      restaurant(booking) {
        return controller.restaurant.getRestaurant(booking.restaurantId);
      },
      user(booking) {
        return controller.user.getUser(booking.userId);
      }
    },
    PreOrder: {
      dish(preOrder) {
        return controller.dish.getDish(preOrder.dishId);
      }
    },
    User: {
      async restaurant(user) {
        if (!user.restaurantId) {
          return null;
        }
        const restaurant = await controller.restaurant.getRestaurant(user.restaurantId);
        return restaurant;
      }
    },
    MeMutation: {
      updateProfile: async (_, { name, phone, photo, password }, { me }) => {
        if (!me) {
          throw new Error("Not authenticated");
        }
        if (!name && !phone && !photo && !password) {
          throw new Error("No data to update");
        }
        const user = await controller.user.updateProfile(me, {name, phone, photo, password});
        return user;
      }
    },
    DishMutation: {
      async updateDish(_, { id, name, description, price, photo, status }, { me }) {
        if (!me) {
          throw new Error("Not authenticated");
        }
        if (!me.restaurantId) {
          throw new Error("You are not restaurant owner");
        }
        if (typeof id !== 'string') {
          throw new Error("id must be string");
        }
        const dish = await controller.dish.updateDish(me.restaurantId, id, { name, description, price, photo, status });
        return dish;
      },
      async createDish(_, { name, description, price, photo, category, order }, { me }) {
        if (!me) {
          throw new Error("Not authenticated");
        }
        if (!me.restaurantId) {
          throw new Error("You are not restaurant owner");
        }
        const dish = await controller.dish.createDish(me.restaurantId, { name, description, price, photo, category, order});
        return dish;
      },
      async deleteDish(_, { id }, { me }) {
        if (!me) {
          throw new Error("Not authenticated");
        }
        if (!me.restaurantId) {
          throw new Error("You are not restaurant owner");
        }
        if (typeof id !== 'string') {
          throw new Error("id must be string");
        }
        const dish = await controller.dish.deleteDish(me.restaurantId, id);
        return dish;
      }
    }
  }
};
