import Footer from "~/component/footer";
import style from '../style/reservation-restaurant.module.scss';
import { createStore } from "solid-js/store";
import { sdk } from "~/tools/request";
import HeaderAdmin from "~/component/header_admin";
import ReservationRestaurantItem from "~/component/reservation-restaurant-item";
import { createEffect, createSignal } from "solid-js";
import { BookItem } from "~/component/booking-item";
import { getDate } from "~/tools/date";

export default function ReservationRestaurant() {
  const [filter, setFilter] = createStore<{ date: string }>({ date: getDate(new Date().toString()) });
  const [bookings, setBookings] = createSignal<{ bookings: BookItem[] }>({ bookings: [] });
  createEffect(async () => {
    const res = await sdk.ActiveRestaurantBookings({ filter: { date: filter.date } });
    console.log(res);
    setBookings({ bookings: res.booking?.activeBookings || [] });
  });

  return (
    <>
      <HeaderAdmin></HeaderAdmin>
      <main class={style.main}>
        <div class={style.filter}>
          List of reservations
          <div class={style.filter_date}>
            <input class={style.filter_date_inp} type="date" placeholder="Date" onclick={(t) => t.target.showPicker()} pattern="mm-dd" oninput={(e) => setFilter('date', e.target.value)} value={filter.date} />
          </div>
        </div>
        <div class={style.list}>
          {bookings().bookings.map((booking) => (
            <ReservationRestaurantItem booking={booking} />
          ))}
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}
