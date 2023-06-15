CREATE TABLE restaurant (
    id SERIAL PRIMARY KEY,
    name TEXT,
    address text,
    link TEXT,
    bio TEXT,
    work_hours TSRANGE
);

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name TEXT,
    phone TEXT
);

CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurant(id),
    user_id INTEGER REFERENCES "user"(id),
    date_from TIMESTAMP,
    date_to TIMESTAMP,
    place text,
    name TEXT,
    phone TEXT
);

CREATE TABLE dish (
    id SERIAL PRIMARY KEY,
    menu_id INTEGER REFERENCES menu(id),
    name TEXT,
    description TEXT,
    category TEXT,
    price INTEGER
);

CREATE TABLE pre_order (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER REFERENCES reservation(id),
    dish_id INTEGER,
    count INTEGER,
    description TEXT
);

CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurant(id),
    date_from TIMESTAMP,
    date_to TIMESTAMP,
    rank INTEGER
);

CREATE TABLE "dish_photo" (
    "id" SERIAL PRIMARY KEY,
    "dish_id" INTEGER REFERENCES "dish" ("id"),
    "photo" TEXT
);

CREATE TABLE "position" (
    "id" SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurant(id),
    "setting" TEXT
);

CREATE TABLE "position_photo" (
    "id" SERIAL PRIMARY KEY,
    "position_id" INTEGER REFERENCES "position" ("id"),
    "photo" text
);


CREATE TABLE "restaurant_photo" (
    "id" SERIAL PRIMARY KEY,
    "restaurant_id" INTEGER REFERENCES "restaurant" ("id"),
    "photo" text
);

CREATE TABLE "user_photo" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user" ("id"),
    "photo" text
);

CREATE TABLE "tags_filter" (
    "id" SERIAL PRIMARY KEY,
    "name" text,
    "category" text
);

CREATE TABLE "restaurant_tag" (
    "id" SERIAL PRIMARY KEY,
    "tags_filter_id" INTEGER REFERENCES "tags_filter" ("id"),
    "restaurant_id" INTEGER REFERENCES "restaurant" ("id")
);
