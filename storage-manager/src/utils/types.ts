export enum Event {
  SALE = "Sale",
  RESTOCK = "Restock",
  RETURN = "Return",
  PRICE_CHANGE = "Price Change",
  ADJUSTMENT = "Adjustment",
}

export type ReportFilters = {
  eventType: Event;
  productId: number | null;
  storeId: number | null;
  storeChainId: number | null;
  dateRange: { start: Date | null; end: Date | null };
};

export type DisplayReportFilters = {
  eventType: Event;
  productName: string;
  storeName: string;
  storeChainName: string;
  dateRange: { start: Date | null; end: Date | null };
};

export type SaleReport = {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  saleDate: Date;
  storeId: number;
  Store: {
    id: number;
    name: string;
    location: string;
  };
};

export type RestockReport = {
  id: number;
  productId: number;
  quantity: number;
  restockDate: Date;
  storeId: number;
  supplier?: string | null;
  Store: {
    id: number;
    name: string;
    location: string;
  };
};

export type ReturnReport = {
  id: number;
  productId: number;
  quantity: number;
  returnDate: Date;
  reason?: string | null;
  storeId: number;
  Store: {
    id: number;
    name: string;
    location: string;
  };
};

export type PriceChangeReport = {
  id: number;
  productId: number;
  oldPrice: number;
  newPrice: number;
  changeDate: Date;
  storeId: number;
  Store: {
    id: number;
    name: string;
    location: string;
  };
};

export type AdjustmentReport = {
  id: number;
  productId: number;
  quantity: number;
  adjustmentDate: Date;
  storeId: number;
  Store: {
    id: number;
    name: string;
    location: string;
  };
};
