import { Header } from "~/component/header";
import style from './search-map.module.scss';
import 'leaflet/dist/leaflet.css';
import classNames from "classnames";
import { MapProvider } from "~/context/map";
import { createEffect, createResource, createSignal, For } from "solid-js";
import Point, { PointType } from "~/component/point";
import { createStore, type Store } from "solid-js/store";

type FilterType = {
  city: string;
  restaurant: string;
  filters: Record<string, boolean>;
  cuisines: Record<string, boolean>;
}

function toId(s: string) {
  return s.toLowerCase().replace(/ /g, '-');
}

function filterPoint(data: PointType, filter: Store<FilterType>) {
  if (filter.city && !data.address.toLowerCase().includes(filter.city.toLowerCase())) {
    return false;
  }
  if (filter.restaurant && !data.name.toLowerCase().includes(filter.restaurant.toLowerCase())) {
    return false;
  }
  const filters = Object.keys(filter.filters).filter((f) => filter.filters[f]);
  console.log('q', filters, data.filters?.map(toId));
  if (filters.length > 0 && !filters.every((f) => data.filters?.map(toId).includes(f))) {
    return false;
  }
  const cuisines = Object.keys(filter.cuisines).filter((f) => filter.cuisines[f]);
  if (cuisines.length > 0 && !cuisines.every((f) => data.cuisines?.map(toId).includes(f))) {
    return false;
  }
  return true;
}

export default function SearchMap() {
  const [filter, setFilterOrigin] = createStore<FilterType>({
    city: '',
    restaurant: '',
    filters: {},
    cuisines: {},
  });
  const [triggerUpdate, setTriggerUpdating] = createSignal(1);
  const setFilter: typeof setFilterOrigin = (...args) => {
    setFilterOrigin(...args);
    setTriggerUpdating((v) => v + 1);
  };
  const [points, action] = createResource(triggerUpdate, async () => {
    const response = await fetch("https://hogwarts.deno.dev/students");
    console.log(filter);
    const result = [
      {
        name: 'Bistro Zepen House',
        address: 'Bratislava, Slovakia',
        lat: 48.14955705102883,
        lng: 17.1148649792775,
        filters: ['something', 'vegan'],
        cuisines: ['italian', 'slovak'],
      }
    ] satisfies PointType[];
    console.log(result);
    return result;
  });
  const [fullFilter] = createResource(async () => {
    return {
      filters: ['Something', 'Vegan', 'Pets allowed', 'Smoking allowed', 'Non-smoking', 'Outdoor seating', 'Indoor seating', 'Takeaway', 'Delivery'],
      cuisines: ['Italian', 'Slovak', 'Asian', 'American', 'Mexican', 'Indian', 'French', 'Greek', 'Spanish', 'Thai', 'Japanese', 'Chinese', 'Vietnamese', 'Korean', 'Turkish', 'Lebanese', 'Mediterranean', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Pizza', 'Burgers', 'Sushi', 'Steak', 'Seafood', 'Desserts', 'Coffee', 'Drinks', 'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Late night'],
    }
  });
  const [isOpenFilter, setIsOpenFilter] = createSignal<boolean>(false);
  const [isOpenCuisines, setIsOpenCuisines] = createSignal<boolean>(false);
  return (
    <>
    <Header></Header>
    <main class="w-full p-4 space-y-2">
      <div class={ style['top-filter'] }>
        <div class={ style['top-filter__row'] }>
          <div class={ style['top-filter__row__column'] }>
            <input 
              class={style['map']} 
              type="text"
              placeholder="City" id="city" 
              oninput={(e) => setFilter('city', e.target.value)}
              value={filter.city}
            />
          </div>
          <div class={ style['top-filter__row__column'] }>
            <input
              class={style['map']}
              type="text"
              placeholder="Restaurant"
              id="restaurant"
              oninput={(e) => setFilter('restaurant', e.target.value)}
              value={filter.restaurant}
            />
          </div>
        </div>
        <div class={ style['top-filter__row'] }>
          <div class={ style['top-filter__row__column'] }>
            <input class={style['date']} type="text" placeholder="Date" />
          </div>
          <div class={ style['top-filter__row__column'] }>
            <div class={ style['time'] }>
              <label for="from">from</label>
              <input type="time" name="from" id="from" />
            </div>
            <div class={ style['time'] }>
              <label for="to">to</label>
              <input type="time" name="to" id="to" />
            </div>
          </div>
          <div class={ style['top-filter__row__column'] }>
            <div class={ style['number'] }>
              <label for="number_people">Number of people</label>
              <input type="number" id="number_people" max={12} min={1} value={1} />
            </div>
          </div>
        </div>
      </div>
      <div class={ style['map-container'] }>
        <div class={ style['map-container__filter'] }>
          <div class={ style['map-container__filter__block'] }>
            <div class={ style['map-container__filter__block__title'] }>
              Filters
            </div>
            <div class={ style['map-container__filter__block__content'] }>
              <For each={ fullFilter()?.filters.slice(0, isOpenFilter() ? -1 : 4) }>
                { (item) => {
                  const idName = toId(item);
                  return (
                    <div class={ style['map-container__filter__block__content__item'] }>
                      <input
                        type="checkbox"
                        name={ idName }
                        id={ idName }
                        onchange={() => {
                          setFilter('filters', idName, (c) => !c);
                        }}
                      />
                      <label for={ idName }>{ item }</label>
                    </div>
                  )
                }}
              </For>
              { isOpenFilter() ? <button onclick={[setIsOpenFilter, false]}>Less</button> : <button onclick={[setIsOpenFilter, true]}>More</button>}
            </div>
          </div>
          <div class={ style['map-container__filter__block'] }>
            <div class={ style['map-container__filter__block__title'] }>
              Cuisine
            </div>
            
            <div class={ style['map-container__filter__block__content'] }>
              <For each={ fullFilter()?.cuisines.slice(0, isOpenCuisines() ? -1 : 4) }>
                { (item) => {
                  const idName = toId(item);
                  return (
                    <div class={ style['map-container__filter__block__content__item'] }>
                      <input
                        type="checkbox"
                        name={ idName }
                        id={ idName }
                        onchange={() => setFilter('cuisines', idName, (c) => !c)}
                      />
                      <label for={ idName }>{ item }</label>
                    </div>
                  )
                }}
              </For>
              { isOpenCuisines() ? <button onclick={[setIsOpenCuisines, false]}>Less</button> : <button onclick={[setIsOpenCuisines, true]}>More</button>}
            </div>
          </div><div class={ style['map-container__filter__block'] }>
            <div class={ style['map-container__filter__block__title'] }>
              Average cost
            </div>
            <div class={ style['map-container__filter__block__content'] }>
              <div class={ classNames(style['map-container__filter__block__content__item'], style['cost']) }>
                <label for="cost_from">from</label>
                <input type="text" name="cost_from" id="cost_from" />
              </div>
              <div class={ classNames(style['map-container__filter__block__content__item'], style['cost']) }>
                <label for="cost_to">to</label>
                <input type="text" name="cost_to" id="cost_to" />
              </div>
            </div>
          </div>
        </div>
        <div class={ style['map-container__map'] }>
          <MapProvider>
            123123123
            <For each={ points() }>
              {(point) => <Point point={point} />}
            </For>
          </MapProvider>
        </div>
      </div>
    </main>
    </>
  );
}
