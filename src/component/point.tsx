import { Marker, point } from "leaflet";
import { onMount, onCleanup } from "solid-js";
import { useMap } from "~/context/map";
const LP = import('leaflet');

export type PointType = {
  name: string,
  address: string,
  lat: number,
  lng: number,
  filters?: string[],
  cuisines?: string[],
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
        point.bindPopup('<b>Bistro Zepen House</b><br>Bratislava, Slovakia');
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