import { Service } from "../service"
import { TokenComponent } from "./token"
import { UserComponent } from "./user"
import { RestaurantComponent } from "./restaurant"
import { ReservationComponent } from "./reservation"
import { DishComponent } from "./dish"
import { PreOrderComponent } from "./preorder"
import { Wrapper } from "./wrapper"
import { PositionComponent } from "./position"
import { TagComponent } from "./tags"

export type Component = {
  user: UserComponent,
  token: TokenComponent,
  restaurant: RestaurantComponent,
  reservation: ReservationComponent,
  dish: DishComponent,
  preOrder: PreOrderComponent,
  wrapper: Wrapper,
  position: PositionComponent,
  tag: TagComponent
}

export function getComponent(services: Service): Component {
  return {
    user: new UserComponent(services),
    token: new TokenComponent(services),
    restaurant: new RestaurantComponent(services),
    reservation: new ReservationComponent(services),
    dish: new DishComponent(services),
    preOrder: new PreOrderComponent(services),
    wrapper: new Wrapper(services),
    position: new PositionComponent(services),
    tag: new TagComponent(services)
  }
}