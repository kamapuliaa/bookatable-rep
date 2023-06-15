import classNames from "classnames";
import { Marker, point } from "leaflet";
import { onMount, onCleanup, Show } from "solid-js";
import { useMap } from "~/context/map";
import style from "./point.module.scss";
import { GetRestaurantsQuery } from "gql/sdk";
const LP = import('leaflet');

type R<T> = Exclude<T, null | undefined>;
export type RestaurantType = R<R<GetRestaurantsQuery['restaurant']>['restaurants']>[0];

export default function Point(props: { point: RestaurantType, click: () => void }) {
  const getMap = useMap();
  if (getMap) {
    const map = getMap();
    if (map) {
      let point: Marker;
      onMount(async () => {
        const L = await LP;
        point = L.marker([props.point.lat, props.point.lng], {
          title: props.point.name,
        }).addTo(map);
        const popup = <div class={style['point']}>
        <div class={classNames(style['point__image'], style['show'])}>
          <Show when={props.point.icons?.length}>
            <img src={props.point.icons[0]}></img>
          </Show>
        </div>
        <div class={style['point_info']}>
          <div class={style['point_info__title']}>{props.point.name}</div>
          <div class={style['point_info__about']}>{props.point.address}</div>
          <div class={style['point_info__actions']}>
            <button class={style['book']} onClick={() => props.click()}>Make reservation</button>
          </div>
        </div>
      </div>;
        point.bindPopup(popup, {
          className: style['point__popup'],
        });
        point.bindTooltip(<div>{props.point.name}</div>, {
          direction: 'top'
        });
      });
      onCleanup(() => {
        if (point) {
          map.removeLayer(point);
        }
      })
    }
  }

  return <></>
}