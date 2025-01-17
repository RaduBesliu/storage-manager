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
    ],
  );

  return {
    renderReports,
  };
};
