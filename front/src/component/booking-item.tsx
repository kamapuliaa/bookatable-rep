import classNames from "classnames";
import { on } from "events";
import { ActiveBookingsQuery } from "gql/sdk";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { getDate, getTime } from "~/tools/date";
import style from '../style/account-bookings.module.scss';

type R<T> = Exclude<T, null | undefined>;
export type BookItem = R<R<ActiveBookingsQuery['booking']>['activeBookings']>[0];

export function BookingItem(props: { booking: BookItem }) {
  const [hideDetails, setHideDetails] = createSignal(true);
  const [showConfirm, setShowConfirm] = createSignal(false);

  const isActive = createMemo(() => {
    return !!(props.booking.preOrder?.length || props.booking.comment);
  })
  return (
    <div class={style.wrap}>
      <div class={style.item}>
        <div class={style.item_left}>
          <div class={style.item_left_title}>
            {props.booking.restaurant?.name || 'Unknown'}
          </div>
          <div class={style.item_left_address}>
            {props.booking.restaurant?.address || 'Unknown'}
          </div>
          <div class={style.item_left_phone}>
            {props.booking.restaurant?.phone || 'Unknown'}
          </div>
          <div class={style.item_left_info}>
            <div class={style.item_left_info_row}>
              <div class={style.item_left_info_row_left}>
                {getDate(props.booking.dateFrom)}
              </div>
              <div class={style.item_left_info_row_right}>
                {props.booking.name}
              </div>
            </div>
            <div class={style.item_left_info_row}>
              <div class={style.item_left_info_row_left}>
                {getTime(props.booking.dateFrom)} - {getTime(props.booking.dateTo)}
              </div>
              <div class={style.item_left_info_row_right}>
                {props.booking.phone}
              </div>
            </div>
          </div>
          <div class={style.item_left_action}>
            <div class={style.item_left_action_detail}>
              View Details
              <button disabled={!isActive()} class={classNames(style.item_left_action_detail_bnt)} onClick={() => setHideDetails((v) => !v)}>
                <div class={classNames(style.item_left_action_detail_bnt_d, { [style.rotate]: hideDetails() })}>
                  V
                </div>
              </button>
            </div>
            <button class={style.item_left_action_cancel} onClick={() => setShowConfirm(true)}>Cancel</button>
          </div>
        </div>
        <div class={style.item_right}>
          pic
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
      <Show when={showConfirm()}>
        <div class={classNames(style['modal_confirm'])}>
          <div class={style['modal_contents']}>
            <h1 class={style['modal_contents_title']}>Are you sure you want to cancel this reservation?</h1>
            <div class={style['modal_contents_body']}>
              <div class={style['modal_contents_body_line']}>
                {props.booking.restaurant?.name || 'Unknown'}
              </div>
              <div class={style['modal_contents_body_row']}>
                <div class={style['modal_contents_body_row_left']}>
                  {getDate(props.booking.dateFrom)}
                </div>
                <div class={style['modal_contents_body_row_right']}>
                  {getTime(props.booking.dateFrom)} - {getTime(props.booking.dateTo)}
                </div>
              </div>
            </div>
            <div class={style['modal_contents_actions']}>
              <button class={style['modal_contents_actions_confirm']}>Confirm</button>
              <button class={style['modal_contents_actions_cancel']} onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}