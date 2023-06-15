import { Service } from "../service";
import { CacheEventEmitter, CacheParams, wrapCache } from "../service/cache";
import { sql } from "../tools/sql";
import { unwrapId } from "../tools/wrap_id";
import { Typedef } from "../types/typename";

export type TagType = {
  restaurant_id: number,
  tag: string
}

export class TagComponent {
  private static eventCache = new CacheEventEmitter();

  constructor(private services: Service) {
  }

  private static cacheParams(v: TagComponent): CacheParams<[string, string]> {
    return {
      cache: v.services.cache,
      key: (restaurantId: string, category: string) => [`tags:${restaurantId}:${category}`, 60],
      emitter: TagComponent.eventCache,

    }
  }

  @wrapCache((v: TagComponent) => TagComponent.cacheParams(v))
  async getTags(restaurantId: string, category: string): Promise<string[]> {
    const rows: TagType[] = await this.services.db.query(sql`select t.name from restaurant_tag r left join tags_filter t on t.id=r.tags_filter_id where restaurant_id = ${unwrapId(restaurantId, Typedef.RestaurantType)} and t.category = ${category}`);
    const result = rows.map(r => r.tag);
    return result;
  }
}
