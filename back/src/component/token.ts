import { Service } from "../service";
import * as jose from "jose";
import { UserTypeD } from "./user";

if (!process.env.SECRET_AUTH) {
  throw new Error("SECRET_AUTH is not defined");
}
const SECRET = new TextEncoder().encode(process.env.SECRET_AUTH);

async function sign(user: UserTypeD): Promise<string> {
  const token = await new jose.SignJWT(user).setProtectedHeader({ alg: 'HS256', typ: "JWT" }).setExpirationTime('1d').sign(SECRET);
  return token;
}

async function verify(token: string): Promise<UserTypeD> {
  const decoded = await jose.jwtVerify(token, SECRET);
  return decoded.payload as UserTypeD;
}

export class TokenComponent {
  constructor(private services: Service) {
  }

  async createToken(user: UserTypeD): Promise<string> {
    const token = await sign(user);
    return token;
  }

  async verifyToken(token: string): Promise<UserTypeD> {
    const user = await verify(token);
    return user;
  }
}