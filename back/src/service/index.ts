import { Cache } from "./cache";
import Database from "./database"
import { Setting } from "./setting";

export type Service = {
  db: Database;
  setting: Setting;
  cache: Cache;
}

export function getService(): Service {
  const setting = new Setting();
  return {
    db: Database.getInstance(setting),
    cache: new Cache(setting),
    setting
  }
}