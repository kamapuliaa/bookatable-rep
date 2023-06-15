import style from '../style/reservation-restaurant.module.scss';
import { getTime } from "~/tools/date";
import { BookItem } from './booking-item';
import classNames from 'classnames';
import { createMemo, createSignal, onMount, Show } from 'solid-js';

export default function ReservationRestaurantItem(props: { booking: BookItem }) {
  const [hideDetails, setHideDetails] = createSignal(true);
  const isActive = createMemo(() => {
    return !!(props.booking.preOrder?.length || props.booking.comment);
  });
  return (
    <>
      <div class={style.list_item}>
        <div class={style.list_item_title}>
          Table №{props.booking.place}   {getTime(props.booking.dateFrom)}-{getTime(props.booking.dateTo)}   {3} People
        </div>
        <div class={style.list_item_info}>
          <div class={style.list_item_info_detail}>
            <div class={style.list_item_info_detail_name}>
              {props.booking.name}
            </div>
            <div class={style.list_item_info_detail_phone}>
              {props.booking.phone}
            </div>
            <div class={style.list_item_info_detail_action}>
              View Details
              <button disabled={!isActive()} class={classNames(style.list_item_info_detail_action_btn)} onClick={() => setHideDetails((v) => !v)}>
                <div class={classNames({ [style.rotate]: hideDetails() }, style.list_item_info_detail_action_btn_p)}>
                  V
                </div>
              </button>
            </div>
          </div>
          <div class={style.list_item_info_action}>
            <button class={classNames(style.list_item_info_action_btn, style.accept)}>Accept</button>
            <button class={classNames(style.list_item_info_action_btn, style.cancel)}>Cancel</button>
          </div>
        </div>
      </div>
      <Show when={isActive()}>
        {(() => {
          let myDiv: HTMLDivElement;
          onMount(() => {
            myDiv.style?.setProperty('--openHeight', myDiv?.scrollHeight + 'px');
          });
          return (
            <div class={classNames(style.dropdown, { [style.hide]: hideDetails() })} ref={(e) => myDiv = e}>
              <Show when={props.booking.preOrder?.length}>
                <div class={style.dropdown_title}>
                  Pre order
                </div>
                <div class={style.dropdown_content}>
                  <For each={props.booking.preOrder}>
                    {(order, index) => (
                      <div class={style.dropdown_content_item}>
                        <div class={style.dropdown_content_item_title}>
                          {index() + 1}.  {order.dish?.name || 'Unknown'}
                        </div>
                        <div class={style.dropdown_content_item_info}>
                          <div class={style.dropdown_content_item_info_detail}>
                            {order.dish?.description || '-'}
                          </div>
                          <div class={style.dropdown_content_item_info_count}>
                            {order.quantity}
                          </div>
                          <div class={style.dropdown_content_item_info_price}>
                            {order.dish?.price ? order.quantity * order.dish?.price : '-'} €
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <div class={style.dropdown_total}>
                  <div class={style.dropdown_total_title}>
                    Total Sum:
                  </div>
                  <div class={style.dropdown_total_price}>
                    {props.booking.preOrder?.reduce((acc, order) => {
                      return acc + (order.dish?.price ? order.quantity * order.dish?.price : 0);
                    }, 0)} €
                  </div>
                </div>
              </Show>
              <Show when={props.booking.comment}>
                <div class={style.dropdown_title}>
                  Comment:
                </div>
                <pre class={style.dropdown_comment}>
                  {props.booking.comment}
                </pre>
              </Show>
            </div>
          )
        })()}
      </Show>
    </>
  );
}
