import { errors } from "jose";
import { Component } from "../component";
import { AuthPayload, User } from "../types/graphql";
import { GraphQLError } from "graphql";
import { UserUpdateType } from "../component/user";

export class UserController {
  constructor(private component: Component) {

  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.component.user.getUser(email);
    if (!user) {
      throw new Error("User not found");
    }
    if (user[1] !== password) {
      throw new Error("email or password is incorrect");
    }
    const token = await this.component.token.createToken(user[0]);
    return {
      __typename: "AuthPayload",
      token,
      user: user[0]
    }
  }

  async logout(user: User): Promise<boolean> {
    return true;
  }

  async signup(email: string, password: string, name: string, phone: string): Promise<AuthPayload> {
    const [user] = await this.component.user.createUser(email, password, name, phone);
    const token = await this.component.token.createToken(user);
    return {
      __typename: "AuthPayload",
      token,
      user
    }
  }

  async getUserFromToken(tolen: string): Promise<User> {
    try {
      const user = await this.component.token.verifyToken(tolen);
      if (!user) {
        throw new Error("Not authenticated");
      }
      return user;
    } catch (error) {
      if (error instanceof errors.JWTExpired) {
        throw new GraphQLError("Token expired");
      }
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    const user = await this.component.user.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateProfile(user: User, data: UserUpdateType): Promise<AuthPayload> {
    const updatedUser = await this.component.user.updateUser(user.id, data);
    if (!updatedUser) {
      throw new Error("Update profile failed");
    }
    const token = await this.component.token.createToken(updatedUser);
    return {
      __typename: "AuthPayload",
      token,
      user: updatedUser
    }
  }
}