import classNames from 'classnames';
import { Dish } from 'gql/graphql';
import { createEffect, createMemo, createSignal, Show, JSX } from 'solid-js';
import { produce } from 'solid-js/store';
import { MenuStore, MenuType } from '~/types/menuStore';
import style from './menu.module.scss';

export function PreOrder(props: { menuStore: MenuStore, dishes: Dish[], styleButton?: string }) {
  const [isOpenMenu, setIsOpenMenu] = createSignal(false);
  createEffect(() => {
    if (isOpenMenu()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

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
        <button disabled={getItem()?.quantity > 9} class={style['menu-item-action-button']} onClick={() => inc()}>+</button>
      </>
    )
  }
  function FindItemMenu(props2: { dish: Dish }) {
    return createObj(props2.dish.id);
  }
  const isDisabled = createMemo(() => {
    return props.menuStore[0].every(e => e.quantity === 0);
  });
  createEffect(() => {
    if (isDisabled()) {
      setIsOpenMenu(false);
    }
  })
  return (
    <Show when={props.dishes.length > 0}>
      <button
        disabled={isDisabled()}
        class={props.styleButton}
        onClick={() => setIsOpenMenu(true)}
      >PRE-ORDER</button>
      <Show when={isOpenMenu()}>
        <div class={classNames(style['bg-modal'])}>
          <div class={classNames(style['modal-contents'], style['preorder'])}>
            <button class={style.close} onClick={() => setIsOpenMenu(false)}>X</button>
            <h1>PRE-ORDER</h1>
            <div class={style['menu-container']}>
              <div class={style['menu-list']}>
              {props.menuStore[0].map(e => props.dishes.find(k => k.id===e.dishId)).map((dish) => (
                  dish &&
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
              <div class={style['menu-total']}>
                <span class={style['menu-total-title']}>Total Sum: </span>
                <span class={style['menu-total-price']}>{props.menuStore[0].reduce((acc, e) => acc + e.quantity * props.dishes.find(k => k.id===e.dishId)?.price, 0)} €</span>

              </div>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  );
}