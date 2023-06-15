import Header from "~/component/header"; 
import Footer from "~/component/footer";
import style from '../style/register.module.scss';
import { useNavigate } from "solid-start";
import { useAccount } from "~/context/account";
import { createStore } from "solid-js/store";
import { sdk } from "~/tools/request";

type RegisterData = {
  email: string,
  password: string,
  phone: string,
  firstName: string,
  lastName: string,
}

export default function MakeReservation() {
  const navigate = useNavigate();
  const { setUser, user } = useAccount();
  if (user()) {
    return navigate('/');
  }
  const [fields, setFields] = createStore<RegisterData>({
    email: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
  });
  async function onSubmit(e: Event) {
    e.preventDefault();
    const res = await sdk.Signup({
      email: fields.email,
      password: fields.password,
      name: `${fields.firstName} ${fields.lastName}`,
      phone: fields.phone,
    });
    if (res.auth?.signup?.token && res.auth?.signup?.user) {
      setUser(res.auth?.signup?.user, res.auth?.signup?.token);
      navigate('/');
    }
  }
  return (
    <>
    <Header></Header>
    <main class={style.main}>
      <div class={style.title}>
      Registration
      </div>
      <form class={style.form} onSubmit={(e) => onSubmit(e)}>
        <div class={style.input}>
          <input class={style.input_text} type="string" id="first_name" name="first_name" placeholder="First name" onInput={(e) => setFields("firstName", e.target.value)} />
          <input class={style.input_text} type="string" id="last_name" name="last_name" placeholder="Last name" onInput={(e) => setFields("lastName", e.target.value)} />
        </div>
        <div class={style.input}>
          <input class={style.input_text} type="tel" id="tel" name="tel" placeholder="Telephone number" onInput={(e) => setFields("phone", e.target.value)} />
        </div>
        <div class={style.input}>
          <input class={style.input_text} type="email" id="email" name="email" placeholder="Email" onInput={(e) => setFields("email", e.target.value)} />
        </div>
        <div class={style.input}>
          <input class={style.input_text} type="password" id="password" name="password" placeholder="Password" onInput={(e) => setFields("password", e.target.value)} />
        </div>
        <div class={style.input}>
          <button class={style.button} type="submit">Register</button>
        </div>
      </form>
    </main>
    <Footer></Footer>
    </>
  );
}
