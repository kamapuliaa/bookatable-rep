import classNames from 'classnames';
import { Dish } from 'gql/graphql';
import { createEffect, createMemo, createSignal, Show, JSX } from 'solid-js';
import { produce } from 'solid-js/store';
import { MenuStore, MenuType } from '~/types/menuStore';
import style from './menu.module.scss';

export function Menu(props: { menuStore: MenuStore, dishes: Dish[], styleButton?: string }) {
  const [isOpenMenu, setIsOpenMenu] = createSignal(false);
  const [selectCategory, setSelectCategory] = createSignal<string>('');
  createEffect(() => {
    if (isOpenMenu()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  const category = createMemo(() => {
    console.log(props.dishes);
    const uniqueCategories = [...new Set(props.dishes.map(dish => dish.category))];
    setSelectCategory(uniqueCategories[0]);
    return uniqueCategories.reduce<Record<string, Dish[]>>((acc, category) => {
      acc[category] = props.dishes.filter(dish => dish.category === category);
      return acc;
    }, {});
  })
  function createObj(dishId: string) {
    const max = 10;
    function getItem(dishes?: MenuType[]) {
      const dish = (dishes || props.menuStore[0]).find((i) => i.dishId === dishId);
      if (dish) {
        return dish;
      }
      const newItem = { dishId, quantity: 0 };
      if (dishes) {
        dishes.push(newItem);
        return newItem;
      }
      props.menuStore[1](produce((dishes) => dishes.push(newItem)));
      return newItem;
    } 
    function inc() {
      props.menuStore[1](produce((dishes) => {
        const dish = getItem(dishes);
        if (dish) {
          dish.quantity += 1;
        };
      }));
    }
    function dec() {
      props.menuStore[1](produce((dishes) => {
        const dish = getItem(dishes);
        if (dish) {
          dish.quantity -= 1;
        };
      }));
    }
    return (
      <>
        <button disabled={getItem()?.quantity <= 0} class={style['menu-item-action-button']} onClick={() => dec()}>-</button>
        <div class={style['menu-item-action-quantity']}>{getItem()?.quantity}</div>
        <button disabled={getItem()?.quantity >= max} class={style['menu-item-action-button']} onClick={() => inc()}>+</button>
      </>
    )
  }
  function FindItemMenu(props2: { dish: Dish }) {
    const item = props.menuStore[0].find((i) => i.dishId === props2.dish.id);
    return createObj(props2.dish.id);
  }
  return (
    <Show when={Object.keys(category()).length > 0}>
      <button
        class={props.styleButton}
        onClick={() => setIsOpenMenu(true)}
      >
        MENU
      </button>
      <Show when={isOpenMenu()}>
        <div class={classNames(style['bg-modal'])}>
          <div class={style['modal-contents']}>
            <button class={style.close} onClick={() => setIsOpenMenu(false)}>X</button>
            <h1>Menu</h1>
            <div class={style['menu-container']}>
              <div class={style['menu-category']}>
                {Object.keys(category()).map((categoryName) => (
                  <button
                    class={classNames(style['category-item'], { [style.active]: selectCategory() === categoryName })}
                    onClick={() => setSelectCategory(categoryName)}
                  >
                    {categoryName}
                  </button>
                ))}
              </div>
              <div class={style['menu-list']}>
                {category()[selectCategory()].map((dish) => (
                  <>
                    <div class={style['menu-item']}>
                      <div class={style['menu-item-image']}>
                        {/* <img src={dish.image} alt={dish.name} /> */}
                      </div>
                      <div class={style['menu-item-content']}>
                        <div class={style['menu-item-content-title']}>
                          <p class={style['menu-item-content-title-name']}>{dish.name}</p>
                          <p class={style['menu-item-content-title-price']}>{dish.price} €</p>
                        </div>
                        <p class={style['menu-item-content-description']}>{dish.description}</p>
                      </div>
                      <div class={style['menu-item-action']}>
                        <FindItemMenu dish={dish} />
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  );
}