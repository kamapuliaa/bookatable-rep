import { createStore } from "solid-js/store";
import { useNavigate } from "solid-start";
import Footer from "~/component/footer";
import Header from "~/component/header";
import { useAccount } from "~/context/account";
import { sdk } from "~/tools/request";
import style from '../style/account-details.module.scss';

export default function AccountDetails() {
  const {user, setUser} = useAccount();
  const navigate = useNavigate();
  const vUser = user();
  if (!vUser) {
    return navigate('/login');
  }
  const [data, setData] = createStore(vUser);
  const onSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const res = await sdk.UpdateProfile(data);
      if (res.me?.updateProfile?.user && res.me?.updateProfile?.token) {
        setUser(res.me.updateProfile.user, res.me.updateProfile.token);
        navigate('/');
      }
    } catch (e) {
      console.error(e);
    }
  }
  return <>
    <Header></Header>
    <main class={style.main}>
      <h1 class={style.title}>Account Details</h1>
      <form class={style.form} onSubmit={(e) => onSubmit(e)}>
        <div class={style.form_names}>
          <label for="name">Name</label>
          <input type="text" id="name" name="name" value={data.name} onInput={(e) => setData('name', e.target.value)} />
        </div>
        <div class={style.form_telephone}>
          <label for="telephone">Telephone number</label>
          <input type="text" id="telephone" name="telephone" value={data.phone} onInput={(e) => setData('phone', e.target.value)} />
        </div>
        <div class={style.form_action}>
          <button type="submit">Save</button>
        </div>
      </form>
    </main>
    <Footer></Footer>
    </>
  ;
}