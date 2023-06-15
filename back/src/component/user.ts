import { Service } from "../service";
import sql from "../tools/sql";
import { unwrapId, wrapId } from "../tools/wrap_id";
import { Typedef } from "../types/typename";

type Maybe<T> = T | null | undefined;

export type UserType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  photo: string;
  password: string;
  restaurant_id: number | null;
}

export type UserTypeD = {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  restaurantId: string | null;
  // password: string;
  __typename: "User";
}

export type UserUpdateType = {
  name?: Maybe<string>;
  phone?: Maybe<string>;
  photo?: Maybe<string>;
  password?: Maybe<string>;
}

const builder = sql.builder<UserType>('"user"', [
  "id", "email", "name", "password", "phone", "photo", "restaurant_id"
]);

export class UserComponent {
  constructor(private services: Service) {
  }

  decorate(user: UserType): [UserTypeD, string] {
    const { password, ...rest } = user;
    return [{
      ...rest,
      __typename: "User",
      id: wrapId(user.id, Typedef.UserType),
      restaurantId: user.restaurant_id ? wrapId(user.restaurant_id, Typedef.RestaurantType) : null
    }, password]
  }

  async getUser(email: string): Promise<[UserTypeD, string] | undefined> {
    const user = await builder.selectAll().eq({ email }).limit(1).query(this.services);
    return user[0] && this.decorate(user[0]);
  }

  async createUser(email: string, password: string, name: string, phone: string): Promise<[UserTypeD, string]> {
    const checkUser = await this.getUser(email);
    if (checkUser) {
      throw new Error("User already exist");
    }
    const user = await builder.insert().fields(['email', 'password', 'name', 'phone']).item([
      email, password, name, phone
    ]).query(this.services);
    if (!user[0]) {
      throw new Error("User not created");
    }
    return this.decorate(user[0]);
  }

  async getUserById(id: string): Promise<UserTypeD | undefined> {
    const user = await builder.selectAll().eq({ id: unwrapId(id, Typedef.UserType) }).limit(1).query(this.services);
    return user[0] && this.decorate(user[0])[0];
  }

  async updateUser(id: string, data: UserUpdateType): Promise<UserTypeD> {
    const query = builder.update();
    if (data.name) {
      query.set('name', data.name);
    }
    if (data.phone) {
      query.set('phone', data.phone);
    }
    if (data.photo) {
      query.set('photo', data.photo);
    }
    if (data.password) {
      query.set('password', data.password);
    }
    const user = await query.eq({ id: unwrapId(id, Typedef.UserType) }).query(this.services);
    return this.decorate(user[0])[0];
  }
}