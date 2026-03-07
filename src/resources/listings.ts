import type { CsfloatHttpClient } from "../client.js";
import { CsfloatSdkError } from "../errors.js";
import { paginateCursor } from "../pagination.js";
import type {
  CsfloatBid,
  CreateListingRequest,
  CreateAuctionListingRequest,
  CreateBuyNowListingRequest,
  CsfloatListing,
  CsfloatListingsResponse,
  CsfloatListParams,
  QueryParams,
  UpdateListingRequest,
} from "../types.js";

export class ListingsResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getListings(params: CsfloatListParams = {}): Promise<CsfloatListingsResponse> {
    return this.client.get<CsfloatListingsResponse>("listings", params as QueryParams);
  }

  iterateListings(params: Omit<CsfloatListParams, "cursor"> = {}) {
    return paginateCursor<CsfloatListingsResponse, CsfloatListing>({
      loadPage: (cursor) =>
        this.getListings(
          cursor === undefined ? { ...params } : { ...params, cursor },
        ),
      getItems: (page) => page.data,
    });
  }

  getListingById(listingId: string): Promise<CsfloatListing> {
    return this.client.get<CsfloatListing>(`listings/${listingId}`);
  }

  getBids(listingId: string): Promise<CsfloatBid[]> {
    return this.client.get<CsfloatBid[]>(`listings/${listingId}/bids`);
  }

  createListing(request: CreateListingRequest): Promise<CsfloatListing> {
    this.validateCreateListingRequest(request);

    return this.client.post<CsfloatListing>("listings", {
      ...request,
      type: request.type ?? "buy_now",
    });
  }

  createBuyNowListing(
    request: Omit<CreateBuyNowListingRequest, "type">,
  ): Promise<CsfloatListing> {
    return this.createListing({
      ...request,
      type: "buy_now",
    });
  }

  createAuctionListing(request: CreateAuctionListingRequest): Promise<CsfloatListing> {
    return this.createListing(request);
  }

  updateListing(listingId: string, request: UpdateListingRequest): Promise<CsfloatListing> {
    return this.client.patch<CsfloatListing>(`listings/${listingId}`, request);
  }

  deleteListing(listingId: string): Promise<CsfloatListing | null> {
    return this.client.delete<CsfloatListing | null>(`listings/${listingId}`);
  }

  unlistListing(listingId: string): Promise<CsfloatListing | null> {
    return this.deleteListing(listingId);
  }

  private validateCreateListingRequest(request: CreateListingRequest): void {
    if (request.description && request.description.length > 32) {
      throw new CsfloatSdkError("description cannot be longer than 32 characters");
    }

    if (request.type === "auction") {
      const allowed = [1, 3, 5, 7, 14];
      if (!allowed.includes(request.duration_days)) {
        throw new CsfloatSdkError(
          "duration_days must be one of: 1, 3, 5, 7, 14",
        );
      }
    }
  }
}
