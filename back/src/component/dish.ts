import { Service } from "../service";
import sql from "../tools/sql";
import { unwrapId, wrapId } from "../tools/wrap_id";
import { Dish, DishStatus } from "../types/graphql";
import { Typedef } from "../types/typename";

export type DishType = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  restaurant_id: number;
  order: number;
  photo?: string;
  status: DishStatus;
}

export type UpdateData = {
  name?: string | null,
  description?: string | null,
  price?: number | null,
  order?: number | null,
  photo?: string | null,
  status?: DishStatus | null
}

export type InsertData = {
  name: string,
  description: string,
  category: string,
  price: number,
  order: number,
  photo?: string | null
}

const builder = sql.builder<DishType & { '"order"': number }>('"dish"', [
  "id", "name", "description", "category", "price", "restaurant_id", '"order"', "photo", "status"
]);

export class DishComponent {
  constructor(private services: Service) {
  }

  decorate(rest: DishType): Dish {
    return {
      __typename: 'Dish',
      id: wrapId(rest.id, Typedef.DishType),
      name: rest.name,
      description: rest.description,
      category: rest.category,
      price: rest.price,
      status: rest.status,
      order: rest.order,
      photo: rest.photo
    }
  }

  async getDishes(restaurantId: number): Promise<Dish[]> {
    const rows = await builder.selectAll().eq({ restaurant_id: restaurantId }).order('"order"').query(this.services);
    return rows.map(this.decorate);
  }

  async getDishById(id: number): Promise<Dish | null> {
    const rows = await builder.selectAll().eq({ id }).limit(1).query(this.services);
    return rows[0] && this.decorate(rows[0]);
  }

  async updateDish(id: string, data: UpdateData): Promise<Dish> {
    const b = await builder.update().eq({ id: unwrapId(id, Typedef.DishType) });
    if (data.name) {
      b.set('name', data.name);
    }
    if (data.description) {
      b.set('description', data.description);
    }
    if (data.price) {
      b.set('price', data.price);
    }
    if (data.order) {
      b.set('order', data.order);
    }
    if (data.photo) {
      b.set('photo', data.photo);
    }
    if (data.status) {
      b.set('status', data.status);
    }
    const rows = await b.query(this.services);
    return rows[0] && this.decorate(rows[0]);
  }

  async createDish(restaurantId: string, data: InsertData): Promise<Dish> {
    const b = await builder.insert().fields([
      'name', 'description', 'price', '"order"', 'photo', 'restaurant_id', 'status', 'category'
    ]).item([
      data.name, data.description, data.price, data.order, data.photo || undefined, unwrapId(restaurantId, Typedef.RestaurantType), DishStatus.Available, data.category
    ]);
    const rows = await b.query(this.services);
    return rows[0] && this.decorate(rows[0]);
  }

  async deleteDish(id: string): Promise<boolean> {
    const rows = await builder.delete().eq({ id: unwrapId(id, Typedef.DishType) }).query(this.services);
    return rows;
  }
}