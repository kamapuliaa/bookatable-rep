import { Maybe, User } from "./graphql"

export type GqlContext = {
  me: Maybe<User>
}