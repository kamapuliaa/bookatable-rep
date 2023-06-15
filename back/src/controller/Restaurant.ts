import { Component } from "../component";
import { Restaurant } from "../types/graphql";

export type RestaurantFilter = {
  name?: string;
  address?: string;
  description?: string;
  ids?: string[];
  avgPrice_from?: number;
  avgPrice_to?: number;
  // avgRating_from?: number;
  // avgRating_to?: number;
  workHours_from?: string;
  workHours_to?: string;
}

export class RestaurantController {
  constructor(private component: Component) {

  }

  async getRestaurants(filter: RestaurantFilter): Promise<Restaurant[]> {
    const restaurants = await this.component.restaurant.getRestaurants();
    return restaurants.filter((restaurant) => {
      if (filter.name && !restaurant.name.includes(filter.name)) {
        return false;
      }
      if (filter.address && !restaurant.address.includes(filter.address)) {
        return false;
      }
      if (filter.description && !restaurant.bio.includes(filter.description)) {
        return false;
      }
      if (filter.ids && !filter.ids.includes(restaurant.id)) {
        return false;
      }
      if (filter.avgPrice_from && restaurant.avgPrice < filter.avgPrice_from) {
        return false;
      }
      if (filter.avgPrice_to && restaurant.avgPrice > filter.avgPrice_to) {
        return false;
      }
      // TODO avgRating_from
      // if (filter.avgRating_from && restaurant.avgRating < filter.avgRating_from) {
      //   return false;
      // }
      // if (filter.avgRating_to && restaurant.avgRating > filter.avgRating_to) {
      //   return false;
      // }
      // if (filter.workHours_from && restaurant.workingHours < filter.workHours_from) {
      //   return false;
      // }
      // if (filter.workHours_to && restaurant.workingHours > filter.workHours_to) {
      //   return false;
      // }
      return true;
    });
  }

  async getRestaurant(id: string): Promise<Restaurant | null> {
    const restaurants = await this.component.restaurant.getRestaurants();
    const restaurant = restaurants.find((restaurant) => restaurant.id === id);
    if (!restaurant) {
      return null;
    }
    return restaurant;
  }

  getPhotos(restaurantId: string): Promise<string[]> {
    return this.component.restaurant.getPhotos(restaurantId);
  }

  getTags(restaurantId: string, category: string): Promise<string[]> {
    return this.component.tag.getTags(restaurantId, category);
  }
}