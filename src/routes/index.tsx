import { useRouteData } from "solid-start";
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { Header } from "~/component/header";

export default function Home() {
  return (
    <>
    <Header></Header>
    <main class="w-full p-4 space-y-2">
      <h1 class="font-bold text-3xl">Hello {'qwe'}</h1>
      <h3 class="font-bold text-xl">Message asd board</h3>
    </main>
    </>
  );
}
