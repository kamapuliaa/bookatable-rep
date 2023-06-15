import { Component } from "../component";
import { unwrapId } from "../tools/wrap_id";
import { Position } from "../types/graphql";
import { Typedef } from "../types/typename";

export class PositionController {
  constructor(private component: Component) {

  }

  async getPositions(restaurantId: string): Promise<Position[]> {
    const restaurantID = unwrapId(restaurantId, Typedef.RestaurantType);
    const positions = await this.component.position.getPositions(restaurantID);
    return positions;
  }
}