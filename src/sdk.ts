import { CsfloatHttpClient, type CsfloatClientOptions } from "./client.js";
import { AccountResource } from "./resources/account.js";
import { HistoryResource } from "./resources/history.js";
import { InventoryResource } from "./resources/inventory.js";
import { ListingsResource } from "./resources/listings.js";
import { MetaResource } from "./resources/meta.js";
import { StallResource } from "./resources/stall.js";
import { UsersResource } from "./resources/users.js";

export class CsfloatSdk {
  readonly client: CsfloatHttpClient;
  readonly account: AccountResource;
  readonly inventory: InventoryResource;
  readonly stall: StallResource;
  readonly listings: ListingsResource;
  readonly history: HistoryResource;
  readonly users: UsersResource;
  readonly meta: MetaResource;

  constructor(options: CsfloatClientOptions) {
    this.client = new CsfloatHttpClient(options);
    this.account = new AccountResource(this.client);
    this.inventory = new InventoryResource(this.client);
    this.stall = new StallResource(this.client);
    this.listings = new ListingsResource(this.client);
    this.history = new HistoryResource(this.client);
    this.users = new UsersResource(this.client);
    this.meta = new MetaResource(this.client);
  }
}
