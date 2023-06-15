import Footer from "~/component/footer";
import style from '../style/menu-restaurant.module.scss';
import { sdk } from "~/tools/request";
import HeaderAdmin from "~/component/header_admin";
import { createEffect, For } from "solid-js";
import { Dish, DishStatus } from "../../gql/sdk";
import { useAccount } from "~/context/account";
import { useNavigate } from "solid-start";
import { DishItem, MenuRestaurantItem } from "~/component/menu-restaurant-item";
import { createStore, produce } from "solid-js/store";

export default function MenuRestaurant() {
  const {user} = useAccount();
  const navigate = useNavigate();
  const restaurant = user()?.restaurant;
  if (!restaurant) {
    navigate('/');
    return;
  }
  const [dishes, setDishes] = createStore<DishItem[]>([]);
  createEffect(async () => {
    const res = await sdk.getDishes({ restaurantId: restaurant.id });
    setDishes(res.restaurant?.restaurant?.dishes || []);
  });

  async function del(dish: DishItem) {
    setDishes(dishes.filter(e => e !== dish));
  }

  function editDish(dishIndex: number, newDish: DishItem) {
    console.log(newDish, dishIndex, dishes);
    setDishes(dishIndex, newDish);
  }
  return (
    <>
      <HeaderAdmin></HeaderAdmin>
      <main class={style.main}>
        <button class={style.title_btn} onClick={() => {setDishes(produce((d) => d.push({
          name: 'new dish',
          description: 'description',
          price: 1,
          photo: '',
          order: Math.max(...dishes.map(e => e.order)) + 1,
          status: DishStatus.Available
        })))}}>Add position</button>
        <div class={style.list}>
          <For each={dishes} >
            {(dish, i) => (<MenuRestaurantItem dish={dish} onDelete={() => del(dish)} updateDish={(n) => editDish(i(), n)} />)}
          </For>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}
