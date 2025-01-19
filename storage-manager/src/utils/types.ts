import type { Alert, Product } from "@prisma/client";

export enum Event {
  SALE = "Sale",
  RESTOCK = "Restock",
  RETURN = "Return",
  PRICE_CHANGE = "Price Change",
  ADJUSTMENT = "Adjustment",
  LOW_STOCK_ALERTS = "Low Stock Alerts",
  SALES_REVENUE_TRENDS = "Sales Revenue Trends",
  PRICE_CHANGE_IMPACT = "Price Change Impact",
  PRODUCT_RETURN_RATES = "Product Return Rates",
  RADIAL_BAR_CHART = "Radial Bar Chart",
  TREEMAP = "Treemap",
  PIE_CHART = "Pie Chart",
  COMPOSED_CHART = "Composed Chart"
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

export type LowStockAlertReport = Record<
  string,
  (Alert & { Product: Product })[]
>;

export type SalesRevenueTrendReport = {
  saleDate: Date;
  _sum: {
    totalPrice: number | null;
  };
  Store?: {
    id: number;
    name: string;
  };
};

export type PriceChangeImpactReport = {
  reason: string | null;
  _count: {
    _all: number;
  };
};

export type ProductReturnRateReport = {
  productId: number;
  returnRate: number;
  totalSold: number;
  productName: string;
  returnedQuantity: number;
};

export type RadialBarReport = {
  name: string;
  uv: number;
  pv: number; 
  fill: string; 
};

export type TreemapData = {
  name: string;
  size: number;
};

export type PieChartData = {
  name: string;
  value: number;
  children?: { name: string; value: number }[];
};

export type CombinedChartData = {
  name: string; 
  totalRevenue?: number; 
  quantitySold?: number; 
  returns?: number; 
  priceChange?: number; 
};
