import Header from "~/component/header";
import Footer from "~/component/footer";
import style from '../style/search-map.module.scss';
import 'leaflet/dist/leaflet.css';
import classNames from "classnames";
import { MapProvider } from "~/context/map";
import { createEffect, createResource, createSignal, For, ResourceSource, Setter, Suspense } from "solid-js";
import { createStore, SetStoreFunction, type Store } from "solid-js/store";
import Point, { RestaurantType } from "~/component/point";
import FilterList from "~/component/filter-list";
import { useNavigate } from "@solidjs/router";
import { useLocation } from "solid-start";
import { sdk } from "~/tools/request";
import { useAccount } from "~/context/account";
import { create } from "domain";

type FilterType = {
  city: string;
  restaurant: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  seats: number;
  filters: Record<string, boolean>;
  cuisines: Record<string, boolean>;
};

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
  if (filters.length > 0 && !filters.every((f) => data.filters?.map(toId).includes(f))) {
    return false;
  }
  const cuisines = Object.keys(filter.cuisines).filter((f) => filter.cuisines[f]);
  if (cuisines.length > 0 && !cuisines.every((f) => data.cuisines?.map(toId).includes(f))) {
    return false;
  }
  return true;
}

async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterLink(filter: FilterType) {
  const params = new URLSearchParams();
  if (filter.city) {
    params.set('city', filter.city);
  }
  if (filter.restaurant) {
    params.set('restaurant', filter.restaurant);
  }
  if (filter.date) {
    params.set('date', filter.date);
  }
  if (filter.timeFrom) {
    params.set('timeFrom', filter.timeFrom);
  }
  if (filter.timeTo) {
    params.set('timeTo', filter.timeTo);
  }
  if (filter.seats > 1) {
    params.set('seats', filter.seats.toString());
  }
  const filters = Object.keys(filter.filters).filter((f) => filter.filters[f]);
  if (filters.length > 0) {
    params.set('filters', filters.join(','));
  }
  const cuisines = Object.keys(filter.cuisines).filter((f) => filter.cuisines[f]);
  if (cuisines.length > 0) {
    params.set('cuisines', cuisines.join(','));
  }
  return params.toString();
}

function parseLink(url: string) {
  const params = new URLSearchParams(url);
  const filter: FilterType = {
    city: params.get('city') || '',
    restaurant: params.get('restaurant') || '',
    date: params.get('date') || '',
    timeFrom: params.get('timeFrom') || '',
    timeTo: params.get('timeTo') || '',
    seats: parseInt(params.get('seats') || '1'),
    filters: {},
    cuisines: {},
  };
  const filters = params.get('filters');
  if (filters) {
    filters.split(',').forEach((f) => {
      filter.filters[f] = true;
    });
  }
  const cuisines = params.get('cuisines');
  if (cuisines) {
    cuisines.split(',').forEach((f) => {
      filter.cuisines[f] = true;
    });
  }
  return filter;
}

export default function SearchMap() {
  const location = useLocation();
  const { user } = useAccount();
  const navigate = useNavigate()
  if (user()?.restaurant) {
    navigate('/reservation-restaurant');
    return;
  }
  const [filter, setFilterOrigin] = createStore<FilterType>(parseLink(location.search));
  const [triggerUpdate, setTriggerUpdating] = createSignal(1);

  createEffect(() => {

  });
  
  const setFilter: SetStoreFunction<FilterType> = (...args: Parameters<SetStoreFunction<FilterType>>) => {
    setFilterOrigin(...args);
    setTriggerUpdating((v) => v + 1);
    navigate(`/search-map?${filterLink(filter)}`, { resolve: true });
  };
  const [points, action] = createResource<RestaurantType[], number>(triggerUpdate, async () => {
    try {
      const point = await sdk.getRestaurants();
      const result = point.restaurant?.restaurants?.filter((p) => filterPoint(p, filter));
      return result || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });
  const [isChoice, setIsChoice] = createSignal(false);
  const [fullFilter] = createResource(async () => {
    return {
      filters: ['Something', 'Vegan', 'Pets allowed'],
      cuisines: ['Ukrainian', 'Italian', 'Slovak', 'Asian'],
      // filters: ['Something', 'Vegan', 'Pets allowed', 'Smoking allowed', 'Non-smoking', 'Outdoor seating', 'Indoor seating', 'Takeaway', 'Delivery'],
      // cuisines: ['Ukrainian', 'Italian', 'Slovak', 'Asian', 'American', 'Mexican', 'Indian', 'French', 'Greek', 'Spanish', 'Thai', 'Japanese', 'Chinese', 'Vietnamese', 'Korean', 'Turkish', 'Lebanese', 'Mediterranean', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Pizza', 'Burgers', 'Sushi', 'Steak', 'Seafood', 'Desserts', 'Coffee', 'Drinks', 'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Late night'],
    }
  });
  function pointClick(point: PointType) {
    if (filter.date && filter.timeFrom) {
      let params = `id=${point.id}&seats=${filter.seats}&date=${filter.date}&time_from=${filter.timeFrom}`;
      if (filter.timeTo) {
        params += `&time_to=${filter.timeTo}`;
      }
      return navigate(`/make-reservation?${params}`, { resolve: true })
    }
    setIsChoice(true);
  }
  const [isOpenFilter, setIsOpenFilter] = createSignal<boolean>(false);
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
            <input class={classNames({[style['warn-input']]: isChoice() && !filter.date})} type="date" placeholder="Date" onclick={(t) => t.target.showPicker()} pattern="mm-dd"  oninput={(e) => setFilter('date', e.target.value)} value={filter.date} />
          </div>
          <div class={ style['top-filter__row__column'] }>
            <div class={ style['time'] }>
              <label for="from">from</label>
              <input class={classNames({[style['warn-input']]: isChoice() && !filter.timeFrom})}  type="time" name="from" id="from" onclick={(t) => t.target.showPicker()} oninput={(e) => setFilter('timeFrom', e.target.value)} value={filter.timeFrom} />
            </div>
            <div class={ style['time'] }>
              <label for="to">to</label>
              <input type="time" name="to" id="to" onclick={(t) => t.target.showPicker()} oninput={(e) => setFilter('timeTo', e.target.value)} value={filter.timeTo} />
            </div>
          </div>
          <div class={ style['top-filter__row__column'] }>
            <div class={ style['number'] }>
              <label for="number_people">Number of people</label>
              <input type="number" id="number_people" max={12} min={1} value={filter.seats} oninput={(e) => setFilter('seats', parseInt(e.target.value, 10))} />
            </div>
          </div>
        </div>
      </div>
      <div class={ style['map-container'] }>
        <div class={ style['map-container__filter'] }>
          <FilterList name="Filters" items={fullFilter()?.filters} values={filter.filters} onChange={(item, value) => setFilter('filters', item, value)}></FilterList>
          <FilterList name="Cuisine" items={fullFilter()?.cuisines} values={filter.cuisines} onChange={(item, value) => setFilter('cuisines', item, value)}></FilterList>
          <div class={ style['map-container__filter__block'] }>
            <div class={ style['map-container__filter__block__title'] }>
              Average cost
            </div>
            <div class={ style['map-container__filter__block__content'] }>
              <div class={ classNames(style['map-container__filter__block__content__item'], style['cost']) }>
                <label for="cost_from">from</label>
                <input type="number" name="cost_from" id="cost_from" />
              </div>
              <div class={ classNames(style['map-container__filter__block__content__item'], style['cost']) }>
                <label for="cost_to">to</label>
                <input type="number" name="cost_to" id="cost_to" />
              </div>
            </div>
          </div>
        </div>
        <div class={ style['map-container__map'] }>
          <MapProvider>
            <Suspense>
              <For each={ points() }>
                {(point) => {
                  return <Point point={point} click={() => { pointClick(point) }} />;
                }}
              </For>
            </Suspense>
          </MapProvider>
        </div>
      </div>
    </main>
    <Footer></Footer>
    </>
  );
}
