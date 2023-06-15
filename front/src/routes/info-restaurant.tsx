import Footer from "~/component/footer";
import style from '../style/menu-restaurant.module.scss';
import { sdk } from "~/tools/request";
import HeaderAdmin from "~/component/header_admin";
import { createEffect, For, onMount, createSignal } from "solid-js";
import { Dish, DishStatus, Restaurant, EditsRestaurantQuery } from "../../gql/sdk";
import { useAccount } from "~/context/account";
import { useNavigate } from "solid-start";
import { DishItem, MenuRestaurantItem } from "~/component/menu-restaurant-item";
import { createStore, produce } from "solid-js/store";

type R<T> = Exclude<T, null | undefined>;
type RestaurantItem = R<R<EditsRestaurantQuery['restaurant']>['restaurant']>;

export default function InfoRestaurant() {
  const { user } = useAccount();
  const navigate = useNavigate();
  const restaurantUser = user()?.restaurant;
  if (!restaurantUser) {
    navigate('/');
    return;
  }
  const [restaurant, setRestaurant] = createSignal<RestaurantItem>();
  onMount(async () => {
    const res = await sdk.editsRestaurant({ id: restaurantUser.id });
    if (!res.restaurant?.restaurant) {
      navigate('/');
      return;
    }
    setRestaurant(res.restaurant?.restaurant);
  });
  const dow = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  return (
    <>
      <HeaderAdmin></HeaderAdmin>
      <main class={style.main}>
        <form class={style.form} onSubmit={() => { }}>
          <div class={style.form_row}>
            <For each={dow}>
              {(d, i) => (
                <>
                  <div class={style.form_row_dow}>
                    {d}
                  </div>
                  <div class={style.form_row_title}>
                    Working hours:
                  </div>
                  <div class={style.form_row_input}>
                    <label>from</label>
                    <input type="time" value={restaurantUser.workingHours} />
                  </div>
                  <div class={style.form_row_input}>
                    <label for="">to</label>
                    <input type="time" value={restaurantUser.workingHours} />
                  </div>
                </>
              )}
            </For>
          </div>
        </form>
      </main>
      <Footer></Footer>
    </>
  );
}
