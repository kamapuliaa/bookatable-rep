import classnames from 'classnames';
import style from './footer.module.scss';

export default function Header() {
  return (
  <>
    <div class={ style['footer'] }>
      <div class={ style['footer_links'] }>
        <div class={ style['footer_links_block'] }>
          <div class={ style['footer_links_block__item'] }>
            Mobile app
          </div>
          <div class={ style['footer_links_block__item'] }>
            Community
          </div>
          <div class={ style['footer_links_block__item'] }>
            Company
          </div>
        </div>
        
        <div class={ style['logo'] }>
          bookatable
        </div>
        <div class={ style['footer_links_block'] }>
          <div class={ style['footer_links_block__item'] }>
            Help desk
          </div>
          <div class={ style['footer_links_block__item'] }>
            Blog
          </div>
          <div class={ style['footer_links_block__item'] }>
            Resources
          </div>
        </div>
      </div>
      <hr class={ style['footer__line'] } />
    </div>
  </>
  )
}