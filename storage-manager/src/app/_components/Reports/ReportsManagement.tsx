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
  const storeIdIfPresent = session.data?.user?.storeId ?? null;
  const [eventWasSelected, setEventWasSelected] = useState(false);

  const [filters, setFilters] = useState<ReportFilters>({
    eventType: Event.SALE,
    productId: null,
    storeId: storeIdIfPresent ?? null,
    storeChainId: null,
    dateRange: {
      start: null, // new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      end: null, // new Date(),
    },
  });

  const { data: products } = api.product.get.useQuery({
    storeId: session.data?.user?.storeId ?? undefined,
  });
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
        onSubmit={(val) => {
          setEventWasSelected(true);
          setFilters({ ...filters, eventType: val as Event });
        }}
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
                      storeChainName: storeChains?.find(
                        (chain) => chain.id === store.storeChainId,
                      )?.name,
                    }))
                : stores?.map((store) => ({
                    key: store.id.toString(),
                    value: store.name,
                    storeChainName: storeChains?.find(
                      (chain) => chain.id === store.storeChainId,
                    )?.name,
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
                      storeName: stores?.find(
                        (store) => store.id === product.storeId,
                      )?.name,
                    }))
                : products?.map((product) => ({
                    key: product.id.toString(),
                    value: product.name,
                    storeName: stores?.find(
                      (store) => store.id === product.storeId,
                    )?.name,
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
                storeChainName: storeChains?.find(
                  (chain) => chain.id === store.storeChainId,
                )?.name,
              })) ?? []
            }
            readOnlyValue={
              storeIdIfPresent
                ? (stores?.find((store) => store.id === storeIdIfPresent)
                    ?.name ?? storeIdIfPresent.toString())
                : undefined
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
                      storeName: stores?.find(
                        (store) => store.id === product.storeId,
                      )?.name,
                    }))
                : products?.map((product) => ({
                    key: product.id.toString(),
                    value: product.name,
                    storeName: stores?.find(
                      (store) => store.id === product.storeId,
                    )?.name,
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
        disabled={
          !eventWasSelected ||
          filters.productId === null ||
          filters.storeId === null ||
          filters.eventType === null
        }
        onClick={() => {
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
        {displayFilters?.eventType === Event.SALE ? (
          saleIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : saleReport && saleReport.length > 0 ? (
            renderSaleReport(saleReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No adjustments found for selected range.
            </div>
          )
        ) : null}

        {displayFilters?.eventType === Event.RESTOCK ? (
          restockIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : restockReport && restockReport.length > 0 ? (
            renderRestockReport(restockReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No adjustments found for selected range.
            </div>
          )
        ) : null}

        {displayFilters?.eventType === Event.RETURN ? (
          returnIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : returnReport && returnReport.length > 0 ? (
            renderReturnReport(returnReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No adjustments found for selected range.
            </div>
          )
        ) : null}

        {displayFilters?.eventType === Event.PRICE_CHANGE ? (
          priceChangeIsLoading ? (
            <LoadingOverlay
              visible={true}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />
          ) : priceChangeReport && priceChangeReport.length > 0 ? (
            renderPriceChangeReport(priceChangeReport)
          ) : (
            <div className="my-20 text-center text-gray-500">
              No adjustments found for selected range.
            </div>
          )
        ) : null}

        {displayFilters?.eventType === Event.ADJUSTMENT ? (
          adjustmentIsLoading ? (
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
          )
        ) : null}
      </Modal>
    </div>
  );
};
