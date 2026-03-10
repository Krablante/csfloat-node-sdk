import type { CsfloatHttpClient } from "../client.js";
import { CsfloatSdkError } from "../errors.js";
import { paginateCursor } from "../pagination.js";
import type {
  BuyNowRequest,
  CsfloatBid,
  CsfloatBuyOrder,
  CreateListingRequest,
  CreateAuctionListingRequest,
  CreateBuyNowListingRequest,
  CsfloatAutoBid,
  CsfloatListingBatchResponse,
  CsfloatListing,
  CsfloatListingsResponse,
  CsfloatListParams,
  CsfloatMessageResponse,
  PlaceBidRequest,
  CsfloatPriceListEntry,
  QueryParams,
  UpdateBulkListingRequest,
  UpdateListingRequest,
} from "../types.js";

export class ListingsResource {
  constructor(private readonly client: CsfloatHttpClient) {}

  getListings(params: CsfloatListParams = {}): Promise<CsfloatListingsResponse> {
    return this.client.get<CsfloatListingsResponse>("listings", params as QueryParams);
  }

  getPriceList(): Promise<CsfloatPriceListEntry[]> {
    return this.client.get<CsfloatPriceListEntry[]>("listings/price-list");
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

  getBuyOrders(listingId: string, params: { limit?: number } = {}): Promise<CsfloatBuyOrder[]> {
    return this.client.get<CsfloatBuyOrder[]>(
      `listings/${listingId}/buy-orders`,
      params as QueryParams,
    );
  }

  getSimilar(listingId: string): Promise<CsfloatListing[]> {
    return this.client.get<CsfloatListing[]>(`listings/${listingId}/similar`);
  }

  addToWatchlist(listingId: string): Promise<CsfloatMessageResponse> {
    return this.client.post<CsfloatMessageResponse>(`listings/${listingId}/watchlist`, {});
  }

  removeFromWatchlist(listingId: string): Promise<CsfloatMessageResponse> {
    return this.client.delete<CsfloatMessageResponse>(`listings/${listingId}/watchlist`);
  }

  buyNow(request: BuyNowRequest): Promise<CsfloatMessageResponse> {
    return this.client.post<CsfloatMessageResponse>("listings/buy", request);
  }

  placeBid(listingId: string, request: PlaceBidRequest): Promise<CsfloatAutoBid> {
    return this.client.post<CsfloatAutoBid>(`listings/${listingId}/bid`, request);
  }

  buyListing(contractId: string, totalPrice: number): Promise<CsfloatMessageResponse> {
    return this.buyNow({
      contract_ids: [contractId],
      total_price: totalPrice,
    });
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

  createBulkListings(requests: CreateListingRequest[]): Promise<CsfloatListing[]> {
    if (requests.length === 0) {
      throw new CsfloatSdkError("at least one listing item is required");
    }

    const items = requests.map((request) => {
      this.validateCreateListingRequest(request);

      return {
        ...request,
        type: request.type ?? "buy_now",
      };
    });

    return this.client
      .post<CsfloatListingBatchResponse>("listings/bulk-list", { items })
      .then((response) => response.data);
  }

  updateBulkListings(modifications: UpdateBulkListingRequest[]): Promise<CsfloatListing[]> {
    if (modifications.length === 0) {
      throw new CsfloatSdkError("at least one listing modification is required");
    }

    return this.client
      .patch<CsfloatListingBatchResponse>("listings/bulk-modify", { modifications })
      .then((response) => response.data);
  }

  deleteBulkListings(contractIds: string[]): Promise<CsfloatMessageResponse> {
    if (contractIds.length === 0) {
      throw new CsfloatSdkError("at least one contract id is required");
    }

    return this.client.patch<CsfloatMessageResponse>("listings/bulk-delist", {
      contract_ids: contractIds,
    });
  }

  unlistBulkListings(contractIds: string[]): Promise<CsfloatMessageResponse> {
    return this.deleteBulkListings(contractIds);
  }

  updateListing(listingId: string, request: UpdateListingRequest): Promise<CsfloatListing> {
    return this.client.patch<CsfloatListing>(`listings/${listingId}`, request);
  }

  updateListingPrice(listingId: string, price: number): Promise<CsfloatListing> {
    return this.updateListing(listingId, { price });
  }

  updateListingDescription(listingId: string, description: string): Promise<CsfloatListing> {
    return this.updateListing(listingId, { description });
  }

  updateListingMaxOfferDiscount(
    listingId: string,
    maxOfferDiscount: number,
  ): Promise<CsfloatListing> {
    return this.updateListing(listingId, { max_offer_discount: maxOfferDiscount });
  }

  updateListingPrivate(listingId: string, isPrivate: boolean): Promise<CsfloatListing> {
    return this.updateListing(listingId, { private: isPrivate });
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
