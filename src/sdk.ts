import { CsfloatHttpClient, type CsfloatClientOptions } from "./client.js";
import { AccountResource } from "./resources/account.js";
import { HistoryResource } from "./resources/history.js";
import { InventoryResource } from "./resources/inventory.js";
import { ListingsResource } from "./resources/listings.js";
import { LoadoutResource } from "./resources/loadout.js";
import { MetaResource } from "./resources/meta.js";
import { StallResource } from "./resources/stall.js";
import { UsersResource } from "./resources/users.js";
import { WorkflowResource } from "./resources/workflows.js";

export class CsfloatSdk {
  readonly client: CsfloatHttpClient;
  readonly account: AccountResource;
  readonly inventory: InventoryResource;
  readonly stall: StallResource;
  readonly listings: ListingsResource;
  readonly loadout: LoadoutResource;
  readonly history: HistoryResource;
  readonly users: UsersResource;
  readonly meta: MetaResource;
  readonly workflows: WorkflowResource;

  constructor(options: CsfloatClientOptions) {
    this.client = new CsfloatHttpClient(options);
    this.account = new AccountResource(this.client);
    this.inventory = new InventoryResource(this.client);
    this.stall = new StallResource(this.client);
    this.listings = new ListingsResource(this.client);
    this.loadout = new LoadoutResource(this.client);
    this.history = new HistoryResource(this.client);
    this.users = new UsersResource(this.client);
    this.meta = new MetaResource(this.client);
    this.workflows = new WorkflowResource(this.account, this.listings, this.stall);
  }
}
