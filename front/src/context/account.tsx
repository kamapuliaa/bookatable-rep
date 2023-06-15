import { Restaurant } from "gql/graphql";
import { User } from "gql/sdk";
import { createSignal, createContext, useContext, onMount, JSX, Accessor } from "solid-js";

export type AccountType = Omit<User, 'restaurant' | 'restaurantId'> & { restaurant?: Pick<Restaurant, 'id' | 'name'> | null };
const UserContext = createContext<{ user: Accessor<AccountType | undefined>, setUser: (u?: AccountType, s?: string) => (AccountType | undefined) }>();

export function AccountProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<AccountType>();

  onMount(() => {
    const session = localStorage.getItem('session');
    const user = localStorage.getItem('user');
    if (session && user) {
      setUser(JSON.parse(user));
    }
  });

  const value = {
    user,
    setUser(user?: AccountType, session?: string) {
      if (!session || !user) {
        localStorage.removeItem('session');
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('session', session);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return setUser(user);
    }
  }

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useAccount() {
  const c = useContext(UserContext);
  if (!c) throw new Error("You are using useAccount outside of AccountProvider");
  return c;
}