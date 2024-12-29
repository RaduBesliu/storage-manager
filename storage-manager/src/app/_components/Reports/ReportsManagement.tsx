"use client";

import React, { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { api } from "~/trpc/react";
import { SearchableSelect } from "../SearchableSelect";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { Badge, Button, Flex, LoadingOverlay, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import { ReportFilters, DisplayReportFilters, Event } from "~/utils/types";
import { useReports } from "./useReports";
import {
  renderAdjustmentReport,
  renderPriceChangeReport,
  renderRestockReport,
  renderReturnReport,
  renderSaleReport,
} from "./renderReports";

type ReportsHeaderProps = {
  onGenerate: (
    filters: ReportFilters,
    displayFilters: DisplayReportFilters,
  ) => void;
};

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ onGenerate }) => {
  // Sales, Restocks, Returns, Price Changes, Adjustments
  // Product, Store, Store Chain

  const session = useSession();

  const [filters, setFilters] = useState<ReportFilters>({
    eventType: Event.SALE,
    productId: null,
    storeId: null,
    storeChainId: null,
    dateRange: {
      start: null, // new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      end: null, // new Date(),
    },
  });

  const { data: products } = api.product.get.useQuery();
  const { data: stores } = api.store.get.useQuery();
  const { data: storeChains } = api.storeChain.get.useQuery();

  return (
    <div className="mx-auto flex flex-wrap gap-2 px-2">
      <SearchableSelect
        data={
          Object.values(Event).map((event) => ({
            key: event as string,
            value: event as string,
          })) ?? []
        }
        onSubmit={(val) => setFilters({ ...filters, eventType: val as Event })}
        placeholder="Search Event Type"
      />
      <DatePickerInput
        type="range"
        placeholder="Pick dates range"
        value={[filters.dateRange.start, filters.dateRange.end]}
        onChange={(value) => {
          setFilters({
            ...filters,
            dateRange: {
              start: value[0],
              end: value[1],
            },
          });
        }}
      />
      {session?.data?.user?.role === Role.SUPER_ADMIN ? (
        <>
          <SearchableSelect
            data={
              storeChains?.map((chain) => ({
                key: chain.id.toString(),
                value: chain.name,
              })) ?? []
            }
            onSubmit={(val) =>
              setFilters({
                ...filters,
                storeChainId: val ? parseInt(val) : null,
              })
            }
            placeholder="Search Store Chain"
          />
          <SearchableSelect
            data={
              (filters.storeChainId
                ? stores
                    ?.filter(
                      (store) => store.storeChainId === filters.storeChainId,
                    )
                    ?.map((store) => ({
                      key: store.id.toString(),
                      value: store.name,
                    }))
                : stores?.map((store) => ({
                    key: store.id.toString(),
                    value: store.name,
                  }))) ?? []
            }
            onSubmit={(val) =>
              setFilters({
                ...filters,
                storeId: val ? parseInt(val) : null,
              })
            }
            placeholder="Search Store"
          />
          <SearchableSelect
            data={
              (filters.storeId
                ? products
                    ?.filter((product) => product.storeId === filters.storeId)
                    ?.map((product) => ({
                      key: product.id.toString(),
                      value: product.name,
                    }))
                : products?.map((product) => ({
                    key: product.id.toString(),
                    value: product.name,
                  }))) ?? []
            }
            onSubmit={(val) =>
              setFilters({
                ...filters,
                productId: val ? parseInt(val) : null,
              })
            }
            placeholder="Search Product"
          />
        </>
      ) : (
        <>
          <SearchableSelect
            data={
              stores?.map((store) => ({
                key: store.id.toString(),
                value: store.name,
              })) ?? []
            }
            onSubmit={(val) =>
              setFilters({
                ...filters,
                storeId: val ? parseInt(val) : null,
              })
            }
            placeholder="Search Store"
          />
          <SearchableSelect
            data={
              (filters.storeId
                ? products
                    ?.filter((product) => product.storeId === filters.storeId)
                    ?.map((product) => ({
                      key: product.id.toString(),
                      value: product.name,
                    }))
                : products?.map((product) => ({
                    key: product.id.toString(),
                    value: product.name,
                  }))) ?? []
            }
            onSubmit={(val) =>
              setFilters({
                ...filters,
                productId: val ? parseInt(val) : null,
              })
            }
            placeholder="Search Product"
          />
        </>
      )}
      <Button
        color="teal"
        onClick={() => {
          console.log("GENERATE", filters);
          onGenerate(filters, {
            eventType: filters.eventType,
            dateRange: {
              start:
                filters.dateRange.start ??
                new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
              end: filters.dateRange.end ?? new Date(),
            },
            productName:
              products?.find((product) => product.id === filters.productId)
                ?.name ?? "",

            storeName:
              stores?.find((store) => store.id === filters.storeId)?.name ?? "",
            storeChainName:
              storeChains?.find((chain) => chain.id === filters.storeChainId)
                ?.name ?? "",
          });
        }}
      >
        Generate Report
      </Button>
    </div>
  );
};

export const ReportsManagement: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>();
  const [displayFilters, setDisplayFilters] = useState<DisplayReportFilters>();
  const [reportOpened, { open: openReport, close: closeReport }] =
    useDisclosure(false);
  const {
    saleReport,
    saleIsLoading,
    restockReport,
    restockIsLoading,
    returnReport,
    returnIsLoading,
    priceChangeReport,
    priceChangeIsLoading,
    adjustmentReport,
    adjustmentIsLoading,
  } = useReports(filters);

  return (
    <div className="flex h-screen items-center gap-2 py-10 align-middle">
      <ReportsHeader
        onGenerate={(filters, displayFilters) => {
          setFilters(filters);
          setDisplayFilters(displayFilters);
          openReport();
        }}
      />
      <Modal
        opened={reportOpened}
        size="100%"
        centered
        onClose={closeReport}
        title={
          <Flex gap="sm">
            <Badge color="lime" size="lg" radius="sm">
              {displayFilters?.eventType}
            </Badge>
            <Badge color="blue" size="lg" radius="sm">
              {displayFilters?.dateRange.start
                ? format(displayFilters.dateRange.start, "MMM dd, yyyy")
                : "N/A"}{" "}
              -{" "}
              {displayFilters?.dateRange.end
                ? format(displayFilters.dateRange.end, "MMM dd, yyyy")
                : "N/A"}
            </Badge>
            {displayFilters?.storeChainName ? (
              <Badge color="orange" size="lg" radius="sm">
                {displayFilters.storeChainName}
              </Badge>
            ) : null}
            {displayFilters?.storeName ? (
              <Badge color="grape" size="lg" radius="sm">
                {displayFilters.storeName}
              </Badge>
            ) : null}
            {displayFilters?.productName ? (
              <Badge color="gray" size="lg" radius="sm">
                {displayFilters.productName}
              </Badge>
            ) : null}
          </Flex>
        }
      >
        {saleIsLoading ? (
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        ) : saleReport ? (
          renderSaleReport(saleReport)
        ) : null}

        {restockIsLoading ? (
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        ) : restockReport ? (
          renderRestockReport(restockReport)
        ) : null}

        {returnIsLoading ? (
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        ) : returnReport ? (
          renderReturnReport(returnReport)
        ) : null}

        {priceChangeIsLoading ? (
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        ) : priceChangeReport ? (
          renderPriceChangeReport(priceChangeReport)
        ) : null}

        {adjustmentIsLoading ? (
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
        ) : adjustmentReport ? (
          renderAdjustmentReport(adjustmentReport)
        ) : null}
      </Modal>
    </div>
  );
};
