import { SetStoreFunction, Store } from "solid-js/store";

export type MenuType = {dishId: string, quantity: number, description?: string}

export type MenuStore = [
  Store<MenuType[]>, SetStoreFunction<MenuType[]>
]