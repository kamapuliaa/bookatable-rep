import { For, Suspense, createEffect, createSignal, Show } from 'solid-js';
import style from './filter-list.module.scss';

function toId(s: string) {
  return s.toLowerCase().replace(/ /g, '-');
}

export default function FilterList(prop: {
  name: string;
  items?: string[];
  onChange: (item: string, value: boolean) => void;
}) {
  const [extend, setExtend] = createSignal<boolean>(false);
  const [open, setOpen] = createSignal<boolean>(true);
  return (
    <Suspense>
      <div class={ style['filter__block'] }>
        <div class={ style['filter__block__title'] }>
          { prop.name }
          <button class={ style['filter__button'] } onClick={() => setOpen((o) => !o)}> { open() ? '⯅' : '⯆' }</button>
        </div>

        <Show when={open()}>
          <div class={ style['filter__block__content'] }>
            <For each={ prop.items?.slice(0, extend() ? -1 : 4) }>
              { (item) => {
                const idName = toId(item);
                return (
                  <div class={ style['filter__block__content__item'] }>
                    <input
                      type="checkbox"
                      name={ idName }
                      id={ idName }
                      onchange={(e) => prop.onChange(item, e.target.checked)}
                    />
                    <label for={ idName }>{ item }</label>
                  </div>
                )
              }}
            </For>
            {
              prop.items?.length > 4 ? (extend() ? (
              <button onclick={[setExtend, false]}>Less</button>
              ) : (
              <button onclick={[setExtend, true]}>More</button>
              )
              ) : null
            }
          </div>
        </Show>
        
      </div>
    </Suspense>
  )
}