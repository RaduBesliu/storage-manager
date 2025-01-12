"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import React, { useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { api } from "~/trpc/react";
import { SearchableSelect } from "../SearchableSelect";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { Badge, Button, Flex, Modal, Title, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import type { ReportFilters, DisplayReportFilters } from "~/utils/types";
import { Event } from "~/utils/types";
import { useReports } from "./useReports";
import { addCurrentTimeToDate, getTimestampForFilename } from "~/utils/utils";

type ReportsHeaderProps = {
  onGenerate: (
    filters: ReportFilters,
    displayFilters: DisplayReportFilters,
  ) => void;
};

const ReportsHeader: React.FC<ReportsHeaderProps> = ({ onGenerate }) => {
  const session = useSession();
  const storeIdIfPresent = session.data?.user?.storeId ?? null;
  const [eventWasSelected, setEventWasSelected] = useState(false);

  const { data: products } = api.product.get.useQuery({
    storeId: session.data?.user?.storeId ?? undefined,
  });
  const { data: stores } = api.store.get.useQuery();
  const { data: storeChains } = api.storeChain.get.useQuery();

  const storeChainIdIfPresent = storeIdIfPresent
    ? stores?.find((store) => store.id === storeIdIfPresent)?.storeChainId
    : null;

  const [filters, setFilters] = useState<ReportFilters>({
    eventType: Event.SALE,
    productId: null,
    storeId: storeIdIfPresent ?? null,
    storeChainId: storeChainIdIfPresent ?? null,
    dateRange: {
      start: null, // new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      end: null, // new Date(),
    },
  });

  return (
    <div className="mx-auto flex flex-col gap-4">
      <div className="mx-2 mb-16 flex flex-wrap justify-center">
        <Title c="white">Report generation</Title>
      </div>
      <div className="mx-2 flex flex-wrap justify-center gap-2">
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
                start: value[0] ? addCurrentTimeToDate(value[0]) : null,
                end: value[1] ? addCurrentTimeToDate(value[1]) : null,
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
                storeChains?.map((chain) => ({
                  key: chain.id.toString(),
                  value: chain.name,
                })) ?? []
              }
              readOnlyValue={
                storeChainIdIfPresent
                  ? (storeChains?.find(
                      (chain) => chain.id === storeChainIdIfPresent,
                    )?.name ?? storeChainIdIfPresent.toString())
                  : undefined
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
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 1),
                  ),
                end: filters.dateRange.end ?? new Date(),
              },
              productName:
                products?.find((product) => product.id === filters.productId)
                  ?.name ?? "",

              storeName:
                stores?.find((store) => store.id === filters.storeId)?.name ??
                "",
              storeChainName:
                storeChains?.find((chain) => chain.id === filters.storeChainId)
                  ?.name ?? "",
            });
          }}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};

const downloadReport = async (filename: string) => {
  const element = document.querySelector(".report-container");

  if (!element) {
    return;
  }

  // This is a workaround for a bug in html2canvas that causes images to be rendered as block elements
  // Badge text is shifted downwards without this
  const style = document.createElement("style");
  document.head.appendChild(style);
  style.sheet?.insertRule(
    "body > div:last-child img { display: inline-block; }",
  );

  try {
    const canvas = await html2canvas(element as HTMLElement, {
      useCORS: true,
      scale: 5,
      ignoreElements: (el) =>
        el.classList.contains("download-report-button-container"),
    }).then((canvas) => {
      style.remove();
      return canvas;
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 dimensions in points (landscape) at 72 DPI = 1 inch in jsPDF
    const a4Width = 842; // 11.69 inches * 72
    const a4Height = 595; // 8.27 inches * 72

    // Calculate the scaling to maintain the original aspect ratio of the canvas
    const canvasAspectRatio = canvas.width / canvas.height;
    const a4AspectRatio = a4Width / a4Height;

    let renderWidth, renderHeight;

    if (canvasAspectRatio > a4AspectRatio) {
      renderWidth = a4Width;
      renderHeight = a4Width / canvasAspectRatio;
    } else {
      renderHeight = a4Height;
      renderWidth = a4Height * canvasAspectRatio;
    }

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt", // Points
      format: "a4",
    });

    // Center the content on the PDF
    const xOffset = (a4Width - renderWidth) / 2; // Center horizontally
    const yOffset = (a4Height - renderHeight) / 2; // Center vertically

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", xOffset, yOffset, renderWidth, renderHeight);

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating report", error);
  }
};

export const ReportsManagement: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>();
  const [displayFilters, setDisplayFilters] = useState<DisplayReportFilters>();
  const [reportOpened, { open: openReport, close: closeReport }] =
    useDisclosure(false);
  const { renderReports } = useReports(filters);
  const reportFilename = `${getTimestampForFilename()}_storage_manager${
    displayFilters?.eventType
      ? "_" + displayFilters?.eventType.trim().replace(" ", "_").toLowerCase()
      : ""
  }_report.pdf`;

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
          <Text c="gray" ms="md" size="lg" fw="bold">
            {displayFilters?.eventType} Report
          </Text>
        }
      >
        <div className="report-container">
          <Modal.Header>
            <Modal.Title>
              <Flex gap="sm">
                <Badge
                  color="lime"
                  size="lg"
                  radius="sm"
                  className="report-badge"
                >
                  {displayFilters?.eventType}
                </Badge>
                <Badge
                  color="blue"
                  size="lg"
                  radius="sm"
                  className="report-badge"
                >
                  {displayFilters?.dateRange.start
                    ? format(
                        displayFilters.dateRange.start,
                        "MMM dd, yyyy, hh:mm:ss a",
                      )
                    : "N/A"}{" "}
                  -{" "}
                  {displayFilters?.dateRange.end
                    ? format(
                        displayFilters.dateRange.end,
                        "MMM dd, yyyy, hh:mm:ss a",
                      )
                    : "N/A"}
                </Badge>
                {displayFilters?.storeChainName ? (
                  <Badge
                    color="orange"
                    size="lg"
                    radius="sm"
                    className="report-badge"
                  >
                    {displayFilters.storeChainName}
                  </Badge>
                ) : null}
                {displayFilters?.storeName ? (
                  <Badge
                    color="grape"
                    size="lg"
                    radius="sm"
                    className="report-badge"
                  >
                    {displayFilters.storeName}
                  </Badge>
                ) : null}
                {displayFilters?.productName ? (
                  <Badge
                    color="gray"
                    size="lg"
                    radius="sm"
                    className="report-badge"
                  >
                    {displayFilters.productName}
                  </Badge>
                ) : null}
              </Flex>
            </Modal.Title>

            <Flex className="download-report-button-container pe-8">
              <Button
                size="xs"
                color="blue"
                onClick={async () => {
                  await downloadReport(reportFilename);
                }}
              >
                Download Report
              </Button>
            </Flex>
          </Modal.Header>
          {displayFilters?.eventType
            ? renderReports(displayFilters.eventType)
            : null}
        </div>
      </Modal>
    </div>
  );
};
