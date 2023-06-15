import classnames from 'classnames';
import { User } from 'gql/sdk';
import { A } from 'solid-start';
import { AccountType, useAccount } from '~/context/account';
import style from './header.module.scss';

function OptionLogin() {
  return <div class={ style['option'] }>
    <A href="/login" class={style.link}>
      <div class={ classnames(style['option__item'], style['login']) }>
          Log in
      </div>
    </A>
    <A href="/register" class={style.link}>
      <div class={ classnames(style['option__item'], style['register']) }>
        Register
      </div>
    </A>
  </div>
}


function Account(props: { user: AccountType }) {
  const { setUser } = useAccount();
  function logout() {
    setUser();
  }
  return <div class={ classnames(style['option']) }>
    <button class={style['account']}>Account</button>
    <span class={style['popup']}>
      <ul>
        <A href="/account-details"><li>Account details</li></A>
        <A href="/account-bookings"><li>Your bookings</li></A>
        <button onClick={logout}><li>Sign out</li></button>
      </ul>
    </span>
  </div>
}

export default function Header() {
  const { user } = useAccount();
  const dUser = user();
  return (
  <>
    <div class={ style['header'] }>
      <A href="/" class={style.link}>
        <div class={ style['logo'] }>
          bookatable
        </div>
      </A>
      { user() ? <Account user={user()} /> : <OptionLogin /> }
    </div>
  </>
  )
}