import { Map } from "leaflet";
import { createSignal, createContext, useContext, onMount, JSX, Accessor } from "solid-js";
const LP = import('leaflet');
// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import XYZ from 'ol/source/XYZ';

const MapContext = createContext<Accessor<Map | undefined>>();

export function MapProvider(props: { children: JSX.Element }) {
  const [map, setMap] = createSignal<Map>();
  const [isLoaded, setIsLoaded] = createSignal(false);

  const id = `map-${(Math.random() + 1).toString(36).substring(7)}`;

  onMount(async () => {
    // because leaflet is not SSR friendly
    const L = await LP;
    const map = L.map(id, {
      zoomSnap: 0.5,
    }).setView([48.1543185,17.1166323], 13.3);
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
    L.tileLayer('https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png?apiKey=35fadee765c4463fafceba23d4f036a5', {
      maxZoom: 20, id: 'osm-bright'
    }).addTo(map);
    setMap(map);
    // const map = new Map({
    //   target: 'map',
    //   layers: [
    //     new TileLayer({
    //       source: new XYZ({
    //         url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    //       })
    //     })
    //   ],
    //   view: new View({
    //     center: [0, 0],
    //     zoom: 2
    //   })
    // });
    setIsLoaded(true);
  });

  return (
    <MapContext.Provider value={map}>
      <div id={ id } style="height:100%"></div>
      { isLoaded() && props.children }
    </MapContext.Provider>
  );
}

export function useMap() { return useContext(MapContext); }