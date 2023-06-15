import { Service } from "../service";
import sql from "../tools/sql";
import { unwrapId, wrapId } from "../tools/wrap_id";
import { Typedef } from "../types/typename";
import { Restaurant, WorkingHour } from "../types/graphql";

export type RestaurantType = {
  id: number;
  address: string;
  bio: string;
  name: string;
  work_hours: WorkingHour;
  avg_price: number;
  geom: { type: string, coordinates: number[] };
  phone: string;
  // TODO avg_rating: number;
}

export type RestaurantPhotoType = {
  restaurant_id: number;
  photo: string;
}

const builder = sql.builder<RestaurantType & { 'ST_AsGeoJSON(geom)::jsonb geom': string }>('"restaurant"', [
  "id", "address", "bio", "name", "work_hours", "avg_price", "ST_AsGeoJSON(geom)::jsonb geom", "phone"
]);

const builderPhoto = sql.builder<RestaurantPhotoType>('"restaurant_photo"', ["photo", "restaurant_id"]);

export class RestaurantComponent {
  constructor(private services: Service) {
  }

  decorate(rest: RestaurantType): Restaurant {
    return {
      address: rest.address,
      bio: rest.bio,
      name: rest.name,
      workingHours: {
        ...rest.work_hours,
        __typename: "WorkingHour"
      },
      __typename: "Restaurant",
      avgPrice: rest.avg_price,
      cuisines: [],
      filters: [],
      lat: rest.geom.coordinates[1],
      lng: rest.geom.coordinates[0],
      id: wrapId(rest.id, Typedef.RestaurantType),
      phone: rest.phone,
    }
  }

  async getRestaurants(): Promise<Restaurant[]> {
    const rows = await builder.selectAll().query(this.services);
    return rows.map(this.decorate);
  }

  async getPhotos(restaurantId: string): Promise<string[]> {
    const rows = await builderPhoto.selectAll().eq({restaurant_id: unwrapId(restaurantId, Typedef.RestaurantType)}).query(this.services);
    return rows.map(row => row.photo);
  }
}