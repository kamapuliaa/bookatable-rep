import { Service } from "../service";

export class Wrapper {
  constructor(private services: Service) {
  }

  async createDbContext<T>(cb: () => Promise<T>) {
    return await this.services.db.getClient(cb);
  }
}