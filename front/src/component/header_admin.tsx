import { A, useNavigate } from 'solid-start';
import { useAccount } from '~/context/account';
import style from './header_admin.module.scss';

export default function HeaderAdmin() {
  const { user, setUser } = useAccount();
  const navigate = useNavigate();
  const dUser = user();
  if (!dUser) {
    navigate('/login');
    return;
  } else if (!dUser.restaurant) {
    navigate('/');
    return
  }
  function logout() {
    setUser();
    navigate('/login');
    return;
  }
  return (
  <>
    <div class={ style['header'] }>
      <A href="/" class={style.link}>
        <div class={ style['logo'] }>
          bookatable: {dUser.restaurant.name}
        </div>
      </A>
      <button onClick={logout} class={style['account']}>Log out</button>
    </div>
    <div class={style.navigation}>
      <A href="/reservation-restaurant" class={style.link}>Reservations</A>
      <A href="/menu-restaurant" class={style.link}>Menu</A>
      <A href="/info-restaurant" class={style.link}>Restaurant Info</A>
    </div>
  </>
  )
}