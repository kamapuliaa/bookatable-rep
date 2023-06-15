import Header from "~/component/header"; 
import Footer from "~/component/footer";
import style from '../style/make-reservation.module.scss';
import classNames from "classnames";
import { fabric } from "fabric";
import { createEffect, createSignal, onMount } from "solid-js";
import { Object as FObject } from "fabric/fabric-impl";
import { useLocation, useNavigate } from "solid-start";
import { sdk } from "~/tools/request";
import { useAccount } from "~/context/account";
import { Menu } from "~/component/menu";
import { createStore } from "solid-js/store";
import { MenuStore, MenuType } from "~/types/menuStore";
import { Dish } from "gql/graphql";
import { PreOrder } from "~/component/preorder";

enum TableStatus {
  Available = 'available',
  Reserved = 'reserved',
  Occupied = 'occupied',
  Unavailable = 'unavailable',
  Select = 'select',
}

type RectParams = {
  top: number,
  left: number,
  width: number,
  height: number,
}
type CircleParams = {
  radius: number,
  top: number,
  left: number,
}
type ParamsCreateObject = { rect: RectParams } | { circle: CircleParams }
function getObjectCanvas(color: string, params: ParamsCreateObject): FObject {
  if ('rect' in params) {
    const rect = new fabric.Rect({
      ...params.rect,
      fill: color,
      hasBorders: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    return rect;
  } else if ('circle' in params) {
    const circle = new fabric.Circle({
      ...params.circle,
      fill: color,
      hasBorders: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    return circle;
  }
  throw new Error('Invalid params');
}

function getColorByStatus(status: TableStatus) {
  switch (status) {
    case TableStatus.Available:
      return '#777E61';
    case TableStatus.Reserved:
      return '#FA6D4E';
    case TableStatus.Occupied:
      return '#D9D9D9';
    case TableStatus.Unavailable:
      return '#D9D9D9';
    case TableStatus.Select:
      return '#FA6D4E';
  }
}

export default function MakeReservation() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.query.id;
  const date = location.query.date;
  const timeFrom = location.query.time_from;
  const timeTo = location.query.time_to || '23:59:59';
  const seats = location.query.seats || 1;
  const [selectTable, setSelectTable] = createSignal<string>();
  if (!id || !date || !timeFrom) {
    return navigate('/search-map');
  }
  const {user} = useAccount();
  if (!user()) {
    return navigate('/login');
  }
  const [mapTable, setMapTable] = createSignal<Record<string, ParamsCreateObject & {status: TableStatus, chairs?: ParamsCreateObject[]}>>();
  const [dishes, setDishes] = createSignal<Dish[]>([]);
  const canvasElBind: Record<string, FObject[]> = {};
  onMount(() => {
    const c = new fabric.Canvas("table-map", {
      backgroundColor: '#f8f8f8',
      hoverCursor: 'pointer',
      selection: false,
      height: 600,
    });
    if (c.getElement().parentNode?.parentNode?.clientWidth) {
      c.setWidth(c.getElement().parentNode?.parentNode?.clientWidth);
    }

    createEffect(() => {
      Object.entries(mapTable() || {}).forEach(([key, value]) => {
        canvasElBind[key] = [];
        const color = getColorByStatus(value.status);
        const obj = getObjectCanvas(color, value);
        canvasElBind[key].push(obj);
        c.add(obj);
        if (value.chairs?.length) {
          value.chairs.forEach((chair) => {
            const obj = getObjectCanvas(color, chair);
            canvasElBind[key].push(obj);
            c.add(obj);
          })
        }
      });
    })

    sdk.prepareBook({ id }).then((res) => {
      if (res.restaurant?.restaurant?.positions?.[0]) {
        setMapTable(JSON.parse(res.restaurant.restaurant.positions[0].settings));
      }
      if (res.restaurant?.restaurant?.dishes) {
        setDishes(res.restaurant.restaurant.dishes);
      }
    });
    
    c.on('mouse:over', function(e) {
      if (e.target) {
        const key = Object.keys(canvasElBind).find((key) => canvasElBind[key].includes(e.target));
        if (key && mapTable()?.[key]?.status === TableStatus.Available && key !== selectTable()) {
          canvasElBind[key].forEach((el) => { el.set('fill', 'brown'); });
          c.renderAll();
        }
      }
    });
  
    c.on('mouse:out', function(e) {
      if (e.target) {
        const key = Object.keys(canvasElBind).find((key) => canvasElBind[key].includes(e.target));
        if (key && mapTable()?.[key]?.status === TableStatus.Available && key !== selectTable()) {
          canvasElBind[key].forEach((el) => { el.set('fill', getColorByStatus(TableStatus.Available)); });
          c.renderAll();
        }
      }
    });
    c.on('mouse:up', function(e) {
      if (e.target) {
        console.log(e);
        const key = Object.keys(canvasElBind).find((key) => canvasElBind[key].includes(e.target));
        if (key && mapTable()?.[key]?.status === TableStatus.Available) {
          const selected = selectTable();
          if (selected === key) {
            canvasElBind[selected].forEach((el) => { el.set('fill', getColorByStatus(TableStatus.Available)); });
            c.renderAll();
            setSelectTable();
            return;
          }
          if (selected) {
            canvasElBind[selected].forEach((el) => { el.set('fill', getColorByStatus(TableStatus.Available)); });
          }
          canvasElBind[key].forEach((el) => { el.set('fill', getColorByStatus(TableStatus.Select)); });
          c.renderAll();
          setSelectTable(key);
        }
      }
    });
  });
  const menu: MenuStore = createStore<MenuType[]>([]);
  const [blockUserInput, setBlockUserInput] = createSignal(false);
  const [phone, setPhone] = createSignal<string>(user()?.phone || '');
  const [name, setName] = createSignal<string>(user()?.name || '');
  async function submit() {
    const selected = selectTable();
    if (!selected) {
      return;
    }
    const res = await sdk.CreateBooking({
      name: name(),
      phone: phone(),
      dateTimeFrom: new Date(`${date} ${timeFrom}`).toISOString(),
      dateTimeTo: new Date(`${date} ${timeTo}`).toISOString(),
      place: selected,
      restaurantId: id,
      preOrder: menu[0].map((item) => ({dishId: item.dishId, quantity: item.quantity, description: item.description})),
    });
    if (res?.booking?.createBooking?.id) {
      navigate(`/account-bookings`);
    }
  }
  return (
    <>
    <Header></Header>
    <main class={style.main}>
      <div class={style.book}>
        <div class={style.book__left}>
          {/* <div class={style.book__left__title}>
            Go to Floor
            1
            2
            3
          </div> */}
          <div class={style.wrapcanvas}>
            <canvas id="table-map" class={style.canvas}></canvas>
          </div>
          <div class={style.book__left__btn}>
            <Menu menuStore={menu} dishes={dishes()} styleButton={style.book__left__btn__menu}/>
          </div>
        </div>
        <div class={style.book__right}>
          <div class={style.book__right__title}>
            <div class={style.book__right__title__num_people}>
              Number of people: {seats}
            </div>
            <div class={style.book__right__title__date}>
              Date: {date}
            </div>
            <div class={style.book__right__title__time}>
              Time of reservation: {timeFrom} - {timeTo || '20:00'}
            </div>
          </div>   
          <div class={style.book__right__user_data}>
            <div>
              <label for="another_people">I’m making reservation for another person</label>
              <input type="checkbox" name="another_people" id="another_people" checked={blockUserInput()} onClick={(e) => setBlockUserInput(e.target.checked)} />
            </div>
            <div>
              <div>
                <label for="name">Name: </label>
                <input disabled={!blockUserInput()} type="text" name="name" id="name" value={name()} onInput={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label for="phone">Phone: </label>
                <input disabled={!blockUserInput()} type="text" name="phone" id="phone" value={phone()} onInput={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>
          <div class={style.book__right__comment}>
            <label for="comment">Comment for restaurant</label>
            <div>
              <textarea name="comment" id="comment" cols="50" rows="10"></textarea>
            </div>
          </div>     
          <div class={style.book__right__btn}>
            <PreOrder menuStore={menu} dishes={dishes()} styleButton={style.book__right__btn__pre}/>
            <button disabled={!selectTable()} class={style.book__right__btn__confirm} onClick={() => submit()}>CONFIRM</button>
          </div>
        </div>
      </div>
    </main>
    <Footer></Footer>
    </>
  );
}
