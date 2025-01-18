import { useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import { LoadingOverlay } from "@mantine/core";
import { type ReportFilters, Event } from "~/utils/types";
import {
  renderAdjustmentReport,
  renderPriceChangeReport,
  renderRestockReport,
  renderReturnReport,
  renderSaleReport,
  renderLowStockAlertsReport,
  renderSalesRevenueTrendsReports,
  renderPriceChangeImpactReport,
  renderProductReturnRatesReport,
} from "./renderReports";

export const useReports = (filters?: ReportFilters) => {
  // Memoize the query filters to ensure stable references
  const queryFilters = useMemo(
    () => ({
      eventType: filters?.eventType ?? Event.SALE,
      storeChainId: filters?.storeChainId ?? null,
      storeId: filters?.storeId ?? null,
      productId: filters?.productId ?? null,
      startDate:
        filters?.dateRange?.start ??
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: filters?.dateRange?.end ?? new Date(),
    }),
    [filters],
  );

  const { data: saleReport, isLoading: saleIsLoading } =
    api.report.getSaleReport.useQuery(queryFilters, {
      enabled: !!queryFilters && queryFilters.eventType === Event.SALE,
    });

  const { data: restockReport, isLoading: restockIsLoading } =
    api.report.getRestockReport.useQuery(queryFilters, {
      enabled: !!queryFilters && queryFilters.eventType === Event.RESTOCK,
    });

  const { data: returnReport, isLoading: returnIsLoading } =
    api.report.getReturnReport.useQuery(queryFilters, {
      enabled: !!queryFilters && queryFilters.eventType === Event.RETURN,
    });

  const { data: priceChangeReport, isLoading: priceChangeIsLoading } =
    api.report.getPriceChangeReport.useQuery(queryFilters, {
      enabled: !!queryFilters && queryFilters.eventType === Event.PRICE_CHANGE,
    });

  const { data: adjustmentReport, isLoading: adjustmentIsLoading } =
    api.report.getAdjustmentReport.useQuery(queryFilters, {
      enabled: !!queryFilters && queryFilters.eventType === Event.ADJUSTMENT,
    });

  const { data: lowStockAlertsReport, isLoading: lowStockAlertsIsLoading } =
    api.report.getLowStockAlerts.useQuery(queryFilters, {
      enabled:
        !!queryFilters && queryFilters.eventType === Event.LOW_STOCK_ALERTS,
    });

  const {
    data: salesRevenueTrendsReport,
    isLoading: salesRevenueTrendsIsLoading,
  } = api.report.getSalesRevenueTrends.useQuery(queryFilters, {
    enabled:
      !!queryFilters && queryFilters.eventType === Event.SALES_REVENUE_TRENDS,
  });

  const {
    data: priceChangeImpactReport,
    isLoading: priceChangeImpactIsLoading,
  } = api.report.getPriceChangeImpact.useQuery(queryFilters, {
    enabled:
      !!queryFilters && queryFilters.eventType === Event.PRICE_CHANGE_IMPACT,
  });

  const {
    data: productReturnRatesReport,
    isLoading: productReturnRatesIsLoading,
  } = api.report.getProductReturnRates.useQuery(queryFilters, {
    enabled:
      !!queryFilters && queryFilters.eventType === Event.PRODUCT_RETURN_RATES,
  });

  console.group("Reports");
  console.log("Low Stock Alerts", lowStockAlertsReport);
  console.log("Sales Revenue Trends", salesRevenueTrendsReport);
  console.log("Price Change Impact", priceChangeImpactReport);
  console.log("Product Return Rates", productReturnRatesReport);
  console.groupEnd();

  const renderReports = useCallback(
    (eventType: Event) => {
      switch (eventType) {
        case Event.SALE:
          return saleIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : saleReport && saleReport.length > 0 ? (
            renderSaleReport(saleReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No sales found for selected range.
            </div>
          );

        case Event.RESTOCK:
          return restockIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : restockReport && restockReport.length > 0 ? (
            renderRestockReport(restockReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No restocks found for selected range.
            </div>
          );

        case Event.RETURN:
          return returnIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : returnReport && returnReport.length > 0 ? (
            renderReturnReport(returnReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No returns found for selected range.
            </div>
          );

        case Event.PRICE_CHANGE:
          return priceChangeIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : priceChangeReport && priceChangeReport.length > 0 ? (
            renderPriceChangeReport(priceChangeReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No price changes found for selected range.
            </div>
          );

        case Event.ADJUSTMENT:
          return adjustmentIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : adjustmentReport && adjustmentReport.length > 0 ? (
            renderAdjustmentReport(adjustmentReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No adjustments found for selected range.
            </div>
          );

        case Event.LOW_STOCK_ALERTS:
          return lowStockAlertsIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : lowStockAlertsReport ? (
            renderLowStockAlertsReport(lowStockAlertsReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No low stock alerts found for selected range.
            </div>
          );

        case Event.SALES_REVENUE_TRENDS:
          return salesRevenueTrendsIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : salesRevenueTrendsReport &&
            salesRevenueTrendsReport.length > 0 ? (
            renderSalesRevenueTrendsReports(salesRevenueTrendsReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No sales revenue trends found for selected range.
            </div>
          );

        case Event.PRICE_CHANGE_IMPACT:
          return priceChangeImpactIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : priceChangeImpactReport && priceChangeImpactReport.length > 0 ? (
            renderPriceChangeImpactReport(priceChangeImpactReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No price change impact found for selected range.
            </div>
          );

        case Event.PRODUCT_RETURN_RATES:
          return productReturnRatesIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : productReturnRatesReport &&
            productReturnRatesReport.length > 0 ? (
            renderProductReturnRatesReport(productReturnRatesReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No product return rates found for selected range.
            </div>
          );

        default:
          return null;
      }
    },
    [
      saleIsLoading,
      saleReport,
      restockIsLoading,
      restockReport,
      returnIsLoading,
      returnReport,
      priceChangeIsLoading,
      priceChangeReport,
      adjustmentIsLoading,
      adjustmentReport,
      lowStockAlertsIsLoading,
      lowStockAlertsReport,
      salesRevenueTrendsIsLoading,
      salesRevenueTrendsReport,
      priceChangeImpactIsLoading,
      priceChangeImpactReport,
      productReturnRatesIsLoading,
      productReturnRatesReport,
    ],
  );

  return {
    renderReports,
  };
};
