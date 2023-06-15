import { Component } from "../component";
import { unwrapId } from "../tools/wrap_id";
import { PreOrder } from "../types/graphql";
import { Typedef } from "../types/typename";

export class PreOrderController {
  constructor(private component: Component) {

  }

  async getPreOrder(reservationId: string): Promise<PreOrder[]> {
    const reservationID = unwrapId(reservationId, Typedef.BookingType);
    const orders = await this.component.preOrder.getDishes(reservationID);
    return orders;
  }
}