import { Service } from "../service";
import sql from "../tools/sql";
import { wrapId } from "../tools/wrap_id";
import { Position } from "../types/graphql";
import { Typedef } from "../types/typename";

export type PositionType = {
    id: number;
    restaurant_id: number,
    setting: string
}

const builder = sql.builder<PositionType>('"position"', [
    "id", "restaurant_id", "setting"
]);

export class PositionComponent {
    constructor(private services: Service) {
    }

    decorate(rest: PositionType): Position {
        return {
          __typename: 'Position',
            id: wrapId(rest.id, Typedef.PositionType),
            settings: rest.setting
        }
    }

    async getPositions(restaurantId: number): Promise<Position[]> {
        const rows = await builder.selectAll().eq({ restaurant_id: restaurantId }).order('id ASC').query(this.services);
        return rows.map(this.decorate);
    }
}