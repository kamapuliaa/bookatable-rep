import { Service } from "../service";
import sql from "../tools/sql";
import { unwrapId, wrapId } from "../tools/wrap_id";
import { OrderInput, PreOrder } from "../types/graphql";
import { Typedef } from "../types/typename";

export type PreOrderType = {
  id: number;
  reservation_id: number;
  dish_id: number;
  count: number;
  description: string;
}

const builder = sql.builder<PreOrderType>('"pre_order"', [
  "id", "description", "dish_id", "count", "reservation_id"
]);

export class PreOrderComponent {
  constructor(private services: Service) {
  }

  decorate(rest: PreOrderType): PreOrder {
    return {
      __typename: 'PreOrder',
      id: wrapId(rest.id, Typedef.PreOrderType),
      dishId: wrapId(rest.dish_id, Typedef.DishType),
      description: rest.description,
      quantity: rest.count
    }
  }

  async getDishes(reservationId: number): Promise<PreOrder[]> {
    const rows = await builder.selectAll().eq({ reservation_id: reservationId }).query(this.services);
    return rows.map(this.decorate);
  }

  async createPreOrder(reservationId: number, orders: OrderInput[]): Promise<PreOrder[]> {
    const wrapOrders = orders.map(o => ({
      ...o,
      dishId: unwrapId(o.dishId, Typedef.DishType)
    }));
    const rows = await builder.insert().fields([
      "description", "dish_id", "count", "reservation_id"
    ]).items(wrapOrders.map(o => [
      o.description || '', o.dishId, o.quantity, reservationId
    ])).query(this.services);
    return rows.map(this.decorate);
  }

  async deleteAllPreOrder(reservationId: string): Promise<boolean> {
    return await builder.delete().eq({ reservation_id: unwrapId(reservationId, Typedef.BookingType) }).query(this.services);
  }
}