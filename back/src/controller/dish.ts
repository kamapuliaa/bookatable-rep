import { Component } from "../component";
import { InsertData, UpdateData } from "../component/dish";
import { unwrapId } from "../tools/wrap_id";
import { Dish } from "../types/graphql";
import { Typedef } from "../types/typename";

export class DishController {
  constructor(private component: Component) {

  }

  async getDishes(restaurantId: string): Promise<Dish[]> {
    const restaurantID = unwrapId(restaurantId, Typedef.RestaurantType);
    const dishes = await this.component.dish.getDishes(restaurantID);
    return dishes;
  }

  async getDish(id: string): Promise<Dish | null> {
    const dishID = unwrapId(id, Typedef.DishType);
    const dish = await this.component.dish.getDishById(dishID);
    return dish;
  }

  async updateDish(restaurantId: string, id: string, data: UpdateData): Promise<Dish> {
    const dishes = await this.getDishes(restaurantId);
    const exists = dishes.find(dish => dish.id === id);
    if (!exists) {
      throw new Error("Dish not found");
    }
    const dish = await this.component.dish.updateDish(id, data);
    return dish;
  }

  async createDish(restaurantId: string, data: InsertData): Promise<Dish> {
    const dish = await this.component.dish.createDish(restaurantId, data);
    return dish;
  }

  async deleteDish(restaurantId: string, id: string): Promise<Dish> {
    const dishes = await this.getDishes(restaurantId);
    const exists = dishes.find(dish => dish.id === id);
    if (!exists) {
      throw new Error("Dish not found");
    }
    const deleted = await this.component.dish.deleteDish(id);
    if (!deleted) {
      throw new Error("Dish not deleted");
    }
    return exists;
  }
}