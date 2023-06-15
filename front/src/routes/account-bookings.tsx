import { createSignal, onMount } from "solid-js";
import { useNavigate } from "solid-start";
import { BookingItem, BookItem } from "~/component/booking-item";
import Footer from "~/component/footer";
import Header from "~/component/header";
import { useAccount } from "~/context/account";
import { sdk } from "~/tools/request";
import style from '../style/account-bookings.module.scss';

export default function ListBookings() {
  const {user} = useAccount();
  const navigate = useNavigate();
  if (!user()) {
    return navigate('/login');
  }
  const [bookings, setBookings] = createSignal<BookItem[]>([]);
  onMount(async () => {
    const res = await sdk.ActiveBookings();
    if (res.booking?.activeBookings) {
      setBookings(res.booking.activeBookings);
    }
  });
  return (
    <>
    <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'></link>
    <Header></Header>
    <main class={style.main}>
      <div class={style.title}>
        Bookings
      </div>
      <div class={style.list}>
        {bookings().map((booking) => (
          <BookingItem booking={booking}></BookingItem>
        ))}
      </div>
    </main>
    <Footer></Footer>
    </>
  );
}