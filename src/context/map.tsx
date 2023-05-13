import { Map } from "leaflet";
import { createSignal, createContext, useContext, onMount, JSX, Accessor } from "solid-js";
const LP = import('leaflet');

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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);
    setMap(map);
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