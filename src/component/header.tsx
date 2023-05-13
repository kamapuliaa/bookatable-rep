import classnames from 'classnames';
import style from './header.module.scss';

export function Header() {
  return (
  <>
    <div class={ style['header'] }>
      <div class={ style['logo'] }>
        bookatable
      </div>
      <div class={ style['option'] }>
        <div class={ classnames(style['option__item'], style['login']) }>
          <a href="/login">Log in</a>
        </div>
        <div class={ classnames(style['option__item'], style['register']) }>
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
  </>
  )
}