import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GqlContext } from './gqlContext';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
  Time: { input: string; output: string; }
};

export type AccountQuery = {
  __typename: 'AccountQuery';
  me?: Maybe<User>;
};

export type AuthMutation = {
  __typename: 'AuthMutation';
  login?: Maybe<AuthPayload>;
  logout?: Maybe<Scalars['Boolean']['output']>;
  signup?: Maybe<AuthPayload>;
};


export type AuthMutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type AuthMutationSignupArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type AuthPayload = {
  __typename: 'AuthPayload';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Booking = {
  __typename: 'Booking';
  comment?: Maybe<Scalars['String']['output']>;
  dateFrom: Scalars['DateTime']['output'];
  dateTo: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  place: Scalars['String']['output'];
  preOrder?: Maybe<Array<PreOrder>>;
  restaurant?: Maybe<Restaurant>;
  restaurantId: Scalars['ID']['output'];
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type BookingFilter = {
  createdAt?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  restaurantId?: InputMaybe<Scalars['ID']['input']>;
  time?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type BookingMutation = {
  __typename: 'BookingMutation';
  createBooking?: Maybe<Booking>;
  deleteBooking?: Maybe<Booking>;
};


export type BookingMutationCreateBookingArgs = {
  date_time_from: Scalars['DateTime']['input'];
  date_time_to?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  place: Scalars['String']['input'];
  preOrder?: InputMaybe<Array<OrderInput>>;
  restaurantId: Scalars['ID']['input'];
};


export type BookingMutationDeleteBookingArgs = {
  id: Scalars['ID']['input'];
};

export type BookingQuery = {
  __typename: 'BookingQuery';
  activeBookings?: Maybe<Array<Booking>>;
  historyBookings?: Maybe<Array<Booking>>;
};


export type BookingQueryActiveBookingsArgs = {
  filter?: InputMaybe<BookingFilter>;
};


export type BookingQueryHistoryBookingsArgs = {
  filter?: InputMaybe<BookingFilter>;
};

export type Dish = {
  __typename: 'Dish';
  category: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  status: DishStatus;
};

export type DishMutation = {
  __typename: 'DishMutation';
  createDish?: Maybe<Dish>;
  deleteDish?: Maybe<Dish>;
  updateDish?: Maybe<Dish>;
};


export type DishMutationCreateDishArgs = {
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  order: Scalars['Int']['input'];
  photo?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
};


export type DishMutationDeleteDishArgs = {
  id: Scalars['ID']['input'];
};


export type DishMutationUpdateDishArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<DishStatus>;
};

export enum DishStatus {
  Available = 'AVAILABLE',
  NotAvailable = 'NOT_AVAILABLE'
}

export type MeMutation = {
  __typename: 'MeMutation';
  updateProfile?: Maybe<AuthPayload>;
};


export type MeMutationUpdateProfileArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename: 'Mutation';
  auth?: Maybe<AuthMutation>;
  booking?: Maybe<BookingMutation>;
  dish?: Maybe<DishMutation>;
  me?: Maybe<MeMutation>;
};

export type OrderInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dishId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type Position = {
  __typename: 'Position';
  id: Scalars['ID']['output'];
  settings: Scalars['String']['output'];
};

export type PreOrder = {
  __typename: 'PreOrder';
  description?: Maybe<Scalars['String']['output']>;
  dish?: Maybe<Dish>;
  dishId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
};

export type Query = {
  __typename: 'Query';
  account?: Maybe<AccountQuery>;
  booking?: Maybe<BookingQuery>;
  restaurant?: Maybe<RestaurantQuery>;
};

export type Restaurant = {
  __typename: 'Restaurant';
  address: Scalars['String']['output'];
  avgPrice: Scalars['Float']['output'];
  bio: Scalars['String']['output'];
  cuisines?: Maybe<Array<Scalars['String']['output']>>;
  dishes?: Maybe<Array<Dish>>;
  filters?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['ID']['output'];
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  photos?: Maybe<Array<Scalars['String']['output']>>;
  positions?: Maybe<Array<Position>>;
  workingHours: WorkingHour;
};

export type RestaurantFilter = {
  address?: InputMaybe<Scalars['String']['input']>;
  avgPrice_from?: InputMaybe<Scalars['Float']['input']>;
  avgPrice_to?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  workingHours_from?: InputMaybe<Scalars['String']['input']>;
  workingHours_to?: InputMaybe<Scalars['String']['input']>;
};

export type RestaurantQuery = {
  __typename: 'RestaurantQuery';
  restaurant?: Maybe<Restaurant>;
  restaurants?: Maybe<Array<Restaurant>>;
};


export type RestaurantQueryRestaurantArgs = {
  id: Scalars['ID']['input'];
};


export type RestaurantQueryRestaurantsArgs = {
  filter?: InputMaybe<RestaurantFilter>;
};

export type User = {
  __typename: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  restaurant?: Maybe<Restaurant>;
  restaurantId?: Maybe<Scalars['ID']['output']>;
};

export type WorkingHour = {
  __typename: 'WorkingHour';
  FRI?: Maybe<Array<Scalars['Time']['output']>>;
  MON?: Maybe<Array<Scalars['Time']['output']>>;
  SAT?: Maybe<Array<Scalars['Time']['output']>>;
  SUN?: Maybe<Array<Scalars['Time']['output']>>;
  THU?: Maybe<Array<Scalars['Time']['output']>>;
  TUE?: Maybe<Array<Scalars['Time']['output']>>;
  WED?: Maybe<Array<Scalars['Time']['output']>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AccountQuery: ResolverTypeWrapper<AccountQuery>;
  AuthMutation: ResolverTypeWrapper<AuthMutation>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  Booking: ResolverTypeWrapper<Booking>;
  BookingFilter: BookingFilter;
  BookingMutation: ResolverTypeWrapper<BookingMutation>;
  BookingQuery: ResolverTypeWrapper<BookingQuery>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Dish: ResolverTypeWrapper<Dish>;
  DishMutation: ResolverTypeWrapper<DishMutation>;
  DishStatus: DishStatus;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MeMutation: ResolverTypeWrapper<MeMutation>;
  Mutation: ResolverTypeWrapper<{}>;
  OrderInput: OrderInput;
  Position: ResolverTypeWrapper<Position>;
  PreOrder: ResolverTypeWrapper<PreOrder>;
  Query: ResolverTypeWrapper<{}>;
  Restaurant: ResolverTypeWrapper<Restaurant>;
  RestaurantFilter: RestaurantFilter;
  RestaurantQuery: ResolverTypeWrapper<RestaurantQuery>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Time: ResolverTypeWrapper<Scalars['Time']['output']>;
  User: ResolverTypeWrapper<User>;
  WorkingHour: ResolverTypeWrapper<WorkingHour>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccountQuery: AccountQuery;
  AuthMutation: AuthMutation;
  AuthPayload: AuthPayload;
  Booking: Booking;
  BookingFilter: BookingFilter;
  BookingMutation: BookingMutation;
  BookingQuery: BookingQuery;
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Dish: Dish;
  DishMutation: DishMutation;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  MeMutation: MeMutation;
  Mutation: {};
  OrderInput: OrderInput;
  Position: Position;
  PreOrder: PreOrder;
  Query: {};
  Restaurant: Restaurant;
  RestaurantFilter: RestaurantFilter;
  RestaurantQuery: RestaurantQuery;
  String: Scalars['String']['output'];
  Time: Scalars['Time']['output'];
  User: User;
  WorkingHour: WorkingHour;
};

export type AccountQueryResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['AccountQuery'] = ResolversParentTypes['AccountQuery']> = {
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthMutationResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['AuthMutation'] = ResolversParentTypes['AuthMutation']> = {
  login?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<AuthMutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  signup?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<AuthMutationSignupArgs, 'email' | 'name' | 'password' | 'phone'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthPayloadResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookingResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['Booking'] = ResolversParentTypes['Booking']> = {
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateFrom?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dateTo?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  place?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preOrder?: Resolver<Maybe<Array<ResolversTypes['PreOrder']>>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  restaurantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookingMutationResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['BookingMutation'] = ResolversParentTypes['BookingMutation']> = {
  createBooking?: Resolver<Maybe<ResolversTypes['Booking']>, ParentType, ContextType, RequireFields<BookingMutationCreateBookingArgs, 'date_time_from' | 'place' | 'restaurantId'>>;
  deleteBooking?: Resolver<Maybe<ResolversTypes['Booking']>, ParentType, ContextType, RequireFields<BookingMutationDeleteBookingArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookingQueryResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['BookingQuery'] = ResolversParentTypes['BookingQuery']> = {
  activeBookings?: Resolver<Maybe<Array<ResolversTypes['Booking']>>, ParentType, ContextType, Partial<BookingQueryActiveBookingsArgs>>;
  historyBookings?: Resolver<Maybe<Array<ResolversTypes['Booking']>>, ParentType, ContextType, Partial<BookingQueryHistoryBookingsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DishResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['Dish'] = ResolversParentTypes['Dish']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['DishStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DishMutationResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['DishMutation'] = ResolversParentTypes['DishMutation']> = {
  createDish?: Resolver<Maybe<ResolversTypes['Dish']>, ParentType, ContextType, RequireFields<DishMutationCreateDishArgs, 'category' | 'description' | 'name' | 'order' | 'price'>>;
  deleteDish?: Resolver<Maybe<ResolversTypes['Dish']>, ParentType, ContextType, RequireFields<DishMutationDeleteDishArgs, 'id'>>;
  updateDish?: Resolver<Maybe<ResolversTypes['Dish']>, ParentType, ContextType, RequireFields<DishMutationUpdateDishArgs, 'id'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeMutationResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['MeMutation'] = ResolversParentTypes['MeMutation']> = {
  updateProfile?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, Partial<MeMutationUpdateProfileArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  auth?: Resolver<Maybe<ResolversTypes['AuthMutation']>, ParentType, ContextType>;
  booking?: Resolver<Maybe<ResolversTypes['BookingMutation']>, ParentType, ContextType>;
  dish?: Resolver<Maybe<ResolversTypes['DishMutation']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['MeMutation']>, ParentType, ContextType>;
};

export type PositionResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['Position'] = ResolversParentTypes['Position']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  settings?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PreOrderResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['PreOrder'] = ResolversParentTypes['PreOrder']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dish?: Resolver<Maybe<ResolversTypes['Dish']>, ParentType, ContextType>;
  dishId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  account?: Resolver<Maybe<ResolversTypes['AccountQuery']>, ParentType, ContextType>;
  booking?: Resolver<Maybe<ResolversTypes['BookingQuery']>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['RestaurantQuery']>, ParentType, ContextType>;
};

export type RestaurantResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['Restaurant'] = ResolversParentTypes['Restaurant']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avgPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bio?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cuisines?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  dishes?: Resolver<Maybe<Array<ResolversTypes['Dish']>>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photos?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  positions?: Resolver<Maybe<Array<ResolversTypes['Position']>>, ParentType, ContextType>;
  workingHours?: Resolver<ResolversTypes['WorkingHour'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RestaurantQueryResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['RestaurantQuery'] = ResolversParentTypes['RestaurantQuery']> = {
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType, RequireFields<RestaurantQueryRestaurantArgs, 'id'>>;
  restaurants?: Resolver<Maybe<Array<ResolversTypes['Restaurant']>>, ParentType, ContextType, Partial<RestaurantQueryRestaurantsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export type UserResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  restaurant?: Resolver<Maybe<ResolversTypes['Restaurant']>, ParentType, ContextType>;
  restaurantId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkingHourResolvers<ContextType = GqlContext, ParentType extends ResolversParentTypes['WorkingHour'] = ResolversParentTypes['WorkingHour']> = {
  FRI?: Resolver<Maybe<Array<ResolversTypes['Time']>>, ParentType, ContextType>;
  MON?: Resolver<Maybe<Array<ResolversTypes['Time']>>, ParentType, ContextType>;
  SAT?: Resolver<Maybe<Array<ResolversTypes['Time']>>, ParentType, ContextType>;
  SUN?: Resolver<Maybe<Array<ResolversTypes['Time']>>, ParentType, ContextType>;
  THU?: Resolver<Maybe<Array<ResolversTypes['Time']>>, ParentType, ContextType>;
  TUE?: Resolver<Maybe<Array<ResolversTypes['Time']>>, ParentType, ContextType>;
  WED?: Resolver<Maybe<Array<ResolversTypes['Time']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GqlContext> = {
  AccountQuery?: AccountQueryResolvers<ContextType>;
  AuthMutation?: AuthMutationResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  Booking?: BookingResolvers<ContextType>;
  BookingMutation?: BookingMutationResolvers<ContextType>;
  BookingQuery?: BookingQueryResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Dish?: DishResolvers<ContextType>;
  DishMutation?: DishMutationResolvers<ContextType>;
  MeMutation?: MeMutationResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Position?: PositionResolvers<ContextType>;
  PreOrder?: PreOrderResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Restaurant?: RestaurantResolvers<ContextType>;
  RestaurantQuery?: RestaurantQueryResolvers<ContextType>;
  Time?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  WorkingHour?: WorkingHourResolvers<ContextType>;
};

