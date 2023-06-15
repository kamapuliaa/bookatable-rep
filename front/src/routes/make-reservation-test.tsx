import Header from "~/component/header"; 
import Footer from "~/component/footer";
import style from '../style/make-reservation.module.scss';
import { fabric } from "fabric";
import { For, createEffect, createSignal, onMount } from "solid-js";
import { Object as FObject } from "fabric/fabric-impl";

enum TableStatus {
  Available = 'available',
  Reserved = 'reserved',
  Occupied = 'occupied',
  Unavailable = 'unavailable',
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
function getObjectCanvas(color: string, params: ParamsCreateObject): FObject | false {
  const same = {
    hasBorders: false,
    hasControls: false,
    // lockMovementX: true,
    // lockMovementY: true,
    fill: color,
  }
  if ('rect' in params) {
    const rect = new fabric.Rect({
      ...params.rect,
      ...same
    });
    return rect;
  } else if ('circle' in params) {
    const circle = new fabric.Circle({
      ...params.circle,
      ...same
    });
    return circle;
  }
  return false;
  // throw new Error('Invalid params');
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
  }
}

export default function MakeReservation() {
  const [mapTable, setMapTable] = createSignal<Record<string, ParamsCreateObject & {status: TableStatus, chairs?: ParamsCreateObject[]}>>();
  const tableLocal = localStorage.getItem('testtable');
  const [position, setPosition] = createSignal<string>(tableLocal || '{"asd":{"rect":{"top":100,"left":100,"width":60,"height":70},"status":"available","chairs":[{"rect":{"top":65,"left":120,"width":20,"height":20}},{"rect":{"top":190,"left":120,"width":20,"height":20}},{"rect":{"top":125,"left":60,"width":20,"height":20}},{"circle":{"top":125,"left":180,"radius":10}}]}}');
  setPosition(JSON.stringify(JSON.parse(position()), undefined, 2));
  const canvasElBind: Record<string, FObject[]> = {};
  const [errorInSintax, setErrorInSintax] = createSignal<string[]>([]);
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
    setMapTable(JSON.parse(position()));

    createEffect(() => {
      setErrorInSintax([]);
      Object.entries(mapTable() || {}).forEach(([key, value]) => {
        canvasElBind[key] = [];
        const color = getColorByStatus(value.status);
        const obj = getObjectCanvas(color, value);
        if (!obj) {
          setErrorInSintax((l) => l.concat(`Invalid params in ${key}`));
          return;
        };
        // obj.on('moving', (iv) => {
        //   console.log(iv)
        //   setMapTable((tables) => {
        //     const newTables = {...tables};
        //     newTables[key].rect.top = iv.target.top;
        //     newTables[key].rect.left = iv.target.left;
        //     return newTables;
        //   })
        // })
        canvasElBind[key].push(obj);
        c.add(obj);
        if (value.chairs?.length) {
          value.chairs.forEach((chair, i) => {
            const obj = getObjectCanvas(color, chair);
            if (!obj) {
              setErrorInSintax((l) => l.concat(`Invalid params in ${key} chair ${i}`));
              return;
            };
            canvasElBind[key].push(obj);
            c.add(obj);
          })
        }
      });
    })
    
    c.on('mouse:over', function(e) {
      if (e.target) {
        const key = Object.keys(canvasElBind).find((key) => canvasElBind[key].includes(e.target));
        if (key && mapTable()?.[key]?.status === TableStatus.Available) {
          canvasElBind[key].forEach((el) => { el.set('fill', 'brown'); });
          c.renderAll();
        }
      }
    });
  
    c.on('mouse:out', function(e) {
      if (e.target) {
        const key = Object.keys(canvasElBind).find((key) => canvasElBind[key].includes(e.target));
        if (key && mapTable()?.[key]?.status === TableStatus.Available) {
          canvasElBind[key].forEach((el) => { el.set('fill', getColorByStatus(TableStatus.Available)); });
          c.renderAll();
        }
      }
    });
    c.on('mouse:up', function(e) {
      if (e.target) {
        console.log(e);
      }
    });
  })
  function usePosition() {
    console.log('123');
    try {
      const d = JSON.parse(position());
      localStorage.setItem('testtable', position());
      Object.values(canvasElBind).forEach((value) => {
        value.forEach((el) => {
          el.canvas?.remove(el);
        });
        value.splice(0, value.length);
      });
      setMapTable(d);
    } catch (e) {
      setErrorInSintax((l) => l.concat(e.message));
      return {};
    }
  }
  createEffect(() => {
    try {
      JSON.parse(position());
      setErrorInSintax([]);
      usePosition();
    } catch (e) {
      setErrorInSintax((l) => l.concat(e.message));
    }
  });
  return (
    <>
    <Header></Header>
    <main class={style.main}>
      <div class={style.book}>
        <div class={style.book__left}>
          <div class={style.wrapcanvas}>
            <canvas id="table-map" class={style.canvas}></canvas>
          </div>
        </div>
        <div class={style.book__right}>
          <div class={style.book__right__comment}>
            <label for="comment">Comment for restaurant</label>
            <div>
              <textarea name="comment" id="comment" style="height: 600px;width: 90%" textContent={position()} onInput={(e) => setPosition(e.target.value)}></textarea>
              {errorInSintax().length && <div>Error in sintax</div>}
              <For each={errorInSintax()}>
                {(error) => <div>{error}</div>}
              </For>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer></Footer>
    </>
  );
}
