import classNames from "classnames";
import { Marker, point } from "leaflet";
import { onMount, onCleanup, Show } from "solid-js";
import { useMap } from "~/context/map";
import style from "./point.module.scss";
const LP = import('leaflet');

export type PointType = {
  name: string,
  address: string,
  lat: number,
  lng: number,
  filters?: string[],
  cuisines?: string[],
  icons?: string[],
}

export default function Point(props: { point: PointType }) {
  const getMap = useMap();
  if (getMap) {
    const map = getMap();
    if (map) {
      let point: Marker;
      onMount(async () => {
        const L = await LP;
        point = L.marker([48.14955705102883, 17.1148649792775], {
          title: 'Bistro Zepen House'
        }).addTo(map);
        point.bindPopup(<div class={style['point']}>
          <div class={classNames(style['point__image'], style['show'])}>
            <Show when={props.point.icons?.length}>
              <img src={props.point.icons[0]}></img>
            </Show>
          </div>
          <div class={style['point_info']}>
            <div class={style['point_info__title']}>Bistro Zepen House</div>
            <div class={style['point_info__about']}>Bratislava, Slovakia</div>
            <div class={style['point_info__actions']}>
              <button class={style['book']}>Make reservation</button>
            </div>
          </div>
        </div>, {
          className: style['point__popup'],
        });
        point.bindTooltip(<div>Zepen House</div>, {
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