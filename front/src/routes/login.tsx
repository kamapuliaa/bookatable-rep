import Header from "~/component/header"; 
import Footer from "~/component/footer";
import style from '../style/login.module.scss';
import { useNavigate } from "solid-start";
import { createStore } from "solid-js/store";
import { sdk } from "~/tools/request";
import { useAccount } from "~/context/account";

export default function MakeReservation() {
  const navigate = useNavigate();
  const { setUser } = useAccount();
  const [fields, setFields] = createStore<{email: string, password: string}>({ email: '', password: '' });

  async function onSubmit(e: Event) {
    e.preventDefault();
    const res = await sdk.Login({ email: fields.email, password: fields.password });
    if (res.auth?.login?.token) {
      setUser(res.auth?.login?.user || undefined, res.auth?.login?.token);
      if (res.auth?.login?.user?.restaurant) {
        navigate('/reservation-restaurant');
      } else {
        navigate('/');
      }
      return;
    }
  }
  return (
    <>
    <Header></Header>
    <main class={style.main}>
      <div class={style.title}>
        Log in
      </div>
      <form class={style.form} onSubmit={(e) => onSubmit(e)}>
        <div class={style.input}>
          <label for="email">Email</label>
          <input class={style.input_text} type="email" id="email" name="email" placeholder="Email" onInput={(e) => setFields("email", e.target.value)} />
        </div>
        <div class={style.input}>
          <label for="password">Password</label>
          <input class={style.input_text} type="password" id="password" name="password" placeholder="Password" onInput={(e) => setFields("password", e.target.value)} />
        </div>
        <div class={style.input}>
          <button class={style.button} onClick={(e) => onSubmit(e)}>Log in</button>
        </div>
      </form>
    </main>
    <Footer></Footer>
    </>
  );
}
