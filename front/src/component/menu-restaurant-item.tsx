import style from '../style/menu-restaurant.module.scss';
import { sdk } from "~/tools/request";
import { createEffect, createMemo } from "solid-js";
import { type CreateDishMutationVariables, Dish, DishStatus, type UpdateDishMutationVariables } from "../../gql/sdk";
import classNames from "classnames";
import { createStore } from "solid-js/store";

export type DishItem = Omit<Dish, 'id' | '__typename' | 'category'> & { id?: Dish['id'] };

export function MenuRestaurantItem(props: { dish: DishItem, onDelete: () => void, updateDish: (dish: DishItem) => void }) {
  const [editableDish, setEditableDish] = createStore<DishItem>({...props.dish});
  createEffect(() => {
    setEditableDish({...props.dish});
  });

  const canSave = createMemo(() => {
    return editableDish.name !== props.dish.name || editableDish.description !== props.dish.description || editableDish.price !== props.dish.price || editableDish.photo !== props.dish.photo || props.dish.id === undefined;
  });

  function onPaste(e: ClipboardEvent & { currentTarget: HTMLInputElement; target: Element } ) {
    const items = e.clipboardData?.items;
    if (!items) {
      return;
    }
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        if (!blob) {
          continue;
        }
        const fd = new FormData();
        fd.append('photo', blob);
        fetch('/api/save-photo', {
          method: 'POST',
          body: fd,
        }).then(res => res.json()).then(res => {
          setEditableDish('photo', res.url);
        });
        return;
      }
    }
  }
  async function create() {
    const upd: CreateDishMutationVariables = {
      category: 'main',
      description: editableDish.description,
      name: editableDish.name,
      photo: editableDish.photo,
      price: editableDish.price,
      order: editableDish.order,
    };
    const res = await sdk.CreateDish(upd);
    const d = res.dish?.createDish;
    if (d) {
      return d;
    }
    throw new Error('Failed to create dish');
  }
  async function update(id: string) {
    const upd: UpdateDishMutationVariables = { updateDishId: id };
    if (editableDish.name !== props.dish.name) {
      upd['name'] = editableDish.name;
    }
    if (editableDish.description !== props.dish.description) {
      upd['description'] = editableDish.description;
    }
    if (editableDish.price !== props.dish.price) {
      upd['price'] = editableDish.price;
    }
    if (editableDish.photo !== props.dish.photo) {
      upd['photo'] = editableDish.photo;
    }
    if (Object.keys(upd).length === 0) {
      throw new Error('Nothing to update');
    }
    const res = await sdk.UpdateDish(upd);
    const d = res.dish?.updateDish;
    if (d) {
      return d;
    }
    throw new Error('Failed to update dish');
  }
  async function save() {
    const id = props.dish.id;
    if (id) {
      const d = await update(id);
      props.updateDish(d);
    } else {
      const d = await create();
      props.updateDish(d);
    }
  }
  async function remove() {
    const id = props.dish.id;
    if (id) {
      await sdk.DeleteDish({ deleteDishId: id });
    }
    props.onDelete();
  }
  async function toggleStatus() {
    const id = props.dish.id;
    if (id) {
      const res = await sdk.UpdateDish({ updateDishId: id, status: editableDish.status === DishStatus.Available ? DishStatus.NotAvailable : DishStatus.Available });
      const d = res.dish?.updateDish;
      if (d) {
        props.updateDish(d);
      }
    }
  }
  return (
    <>
      <div class={style.item}>
        <div class={style.item_info}>
          <div class={style.item_info_position}>{editableDish.order}.</div>
          <div class={style.item_info_details}>
            <div class={style.item_info_details_name}>
              <input type="text" class={style.item_info_details_name_i} value={editableDish.name} onInput={(e) => setEditableDish('name', e.target.value)} />
            </div>
            <div class={style.item_info_details_description}>
              <textarea class={style.item_info_details_description_i} value={editableDish.description} onInput={(e) => setEditableDish('description', e.target.value)} />  
            </div>
          </div>
        </div>
        <div class={style.item_img}>
          {/* <div style={`background-image: url(${editableDish.photo})`} class={style.item_img_photo} /> */}
          <img class={style.item_img_photo} src={editableDish.photo} alt="" />
          {/* <input type="text" class={style.image_input} value={editableDish.photo} onPaste={(e) => onPaste(e)} onInput={(e) => setEditableDish('photo', e.target.value)} /> */}
          <textarea class={style.image_input} value={editableDish.photo} onPaste={(e) => onPaste(e)} onInput={(e) => setEditableDish('photo', e.target.value)} rows={4} cols={30} />
          
        </div>
        <div class={style.item_price}>
          <input type="number" class={style.item_price_i} value={editableDish.price} onInput={(e) => setEditableDish('price', parseFloat(e.target.value))} /> €
        </div>
        <div class={style.item_actions}>
          <button disabled={!canSave()} class={classNames(style.item_actions_btn, style.edit)} onClick={() => save()}>Save</button>
          <button
            class={classNames(style.item_actions_btn, editableDish.status === 'AVAILABLE' ? style.disable : style.enable)}
            onClick={() => toggleStatus()}
          >
            {editableDish.status === 'AVAILABLE' ? 'Disable' : 'Enable'}
          </button>
          <button class={classNames(style.item_actions_btn, style.delete)} onClick={() => remove()}>Delete</button>
        </div>
      </div>
    </>
  );
}
