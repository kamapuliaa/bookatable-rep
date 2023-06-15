import { Component } from "../component";
import { BookingController } from "./booking";
import { UserController } from "./user";
import { RestaurantController } from "./Restaurant";
import { DishController } from "./dish";
import { PreOrderController } from "./preorder";
import { PositionController } from "./position";

export type Controller = {
  user: UserController;
  booking: BookingController;
  restaurant: RestaurantController;
  dish: DishController;
  preOrder: PreOrderController;
  position: PositionController;
}

export function getController(components: Component): Controller {
  return {
    user: new UserController(components),
    booking: new BookingController(components),
    restaurant: new RestaurantController(components),
    dish: new DishController(components),
    preOrder: new PreOrderController(components),
    position: new PositionController(components)
  }
}
