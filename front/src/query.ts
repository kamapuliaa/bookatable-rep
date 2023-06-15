import { graphql } from "gql";

graphql(`
query getRestaurants {
  restaurant {
    restaurants {
      id
      name
      bio
      address
      photos
      avgPrice
      lat
      lng
      filters
      cuisines
    }
  }
}
`);

graphql(`
mutation Login($email: String!, $password: String!) {
  auth {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        phone
        photo
        restaurant {
          id
          name
        }
      }
    }
  }
}
`);

graphql(`
query prepareBook($id: ID!) {
  restaurant {
    restaurant(id: $id) {
      id
      dishes {
        id
        name
        description
        category
        price
        photo
      }
      positions {
        id
        settings
      }
    }
  }
}
`);

graphql(`
query ActiveBookings {
  booking {
    activeBookings {
      restaurant {
        address
        name
        phone
      }
      dateFrom
      dateTo
      name
      phone
      comment
      preOrder {
        quantity
        dish {
          name
          price
          description
        }
        description
      }
    }
  }
}`)

graphql(`
mutation UpdateProfile($name: String, $phone: String, $photo: String, $password: String) {
  me {
    updateProfile(name: $name, phone: $phone, photo: $photo, password: $password) {
      token
      user {
        id
        email
        name
        phone
        photo
        restaurant {
          id
          name
        }
      }
    }
  }
}
`);

graphql(`
mutation Signup($email: String!, $password: String!, $name: String!, $phone: String!) {
  auth {
    signup(email: $email, password: $password, name: $name, phone: $phone) {
      token
      user {
        id
        email
        name
        phone
        photo
        restaurant {
          id
          name
        }
      }
    }
  }
}
`);

graphql(`
query ActiveRestaurantBookings($filter: BookingFilter) {
  booking {
    activeBookings(filter: $filter) {
      dateFrom
      dateTo
      place
      name
      phone
      preOrder {
        description
        dish {
          id
          name
          photo
          price
          description
        }
        quantity
      }
      comment
      id
    }
  }
}
`);

graphql(`
query getDishes($restaurantId: ID!) {
  restaurant {
    restaurant(id: $restaurantId) {
      dishes {
        id
        name
        description
        category
        price
        photo
        status
        order
      }
    }
  }
}
`);

graphql(`
mutation UpdateDish($updateDishId: ID!, $name: String, $description: String, $category: String, $price: Float, $photo: String, $status: DishStatus, $order: Int) {
  dish {
    updateDish(id: $updateDishId, name: $name, description: $description, category: $category, price: $price, photo: $photo, status: $status, order: $order) {
      price
      photo
      order
      name
      description
      id
      category
      status
    }
  }
}`)

graphql(`
mutation CreateDish($name: String!, $description: String!, $category: String!, $price: Float!, $order: Int!, $photo: String) {
  dish {
    createDish(name: $name, description: $description, category: $category, price: $price, order: $order, photo: $photo) {
      id
      name
      description
      category
      price
      photo
      status
      order
    }
  }
}`)

graphql(`
mutation DeleteDish($deleteDishId: ID!) {
  dish {
    deleteDish(id: $deleteDishId) {
      id
      name
      description
      category
      price
      photo
      status
      order
    }
  }
}`);

graphql(`
query editsRestaurant($id: ID!) {
  restaurant {
    restaurant(id: $id) {
      id
      name
      workingHours {
        MON
        TUE
        WED
        THU
        FRI
        SAT
        SUN
      }
      phone
    }
  }
}
`);

graphql(`
mutation CreateBooking($restaurantId: ID!, $dateTimeFrom: DateTime!, $place: String!, $name: String, $phone: String, $dateTimeTo: DateTime, $preOrder: [OrderInput!]) {
  booking {
    createBooking(restaurantId: $restaurantId, date_time_from: $dateTimeFrom, place: $place, name: $name, phone: $phone, date_time_to: $dateTimeTo, preOrder: $preOrder) {
      id
    }
  }
}`)