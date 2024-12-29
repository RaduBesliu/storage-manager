import { useMemo } from "react";
import { api } from "~/trpc/react";
import { ReportFilters, Event } from "~/utils/types";

export const useReports = (filters?: ReportFilters) => {
  // Memoize the query filters to ensure stable references
  const queryFilters = useMemo(
    () => ({
      eventType: filters?.eventType ?? Event.SALE,
      storeChainId: filters?.storeChainId ?? 0,
      storeId: filters?.storeId ?? 0,
      productId: filters?.productId ?? 0,
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

  return {
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
  };
};
