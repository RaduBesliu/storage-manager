"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import {
  Select,
  Group,
  Text,
  Card,
  Badge,
  Flex,
  LoadingOverlay,
  ScrollArea,
  Box,
  Button,
  Title,
} from "@mantine/core";

const StockMonitoring = () => {
  const [filters, setFilters] = useState<{
    productId?: number;
    storeId?: number;
    storeChainId?: number;
  }>({});

  const { data: storeChains } = api.storeChain.get.useQuery();
  const { data: stores } = api.store.get.useQuery();
  const { data: products } = api.product.get.useQuery();
  const { data: stockData, isLoading } = api.stock.getStock.useQuery(filters, {
    enabled: !!Object.keys(filters).length,
  });

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value ? parseInt(value, 10) : undefined,
    }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <Box
      p="md"
      style={{
        background: "transparent",
        padding: "2rem",
      }}
    >
      <Title
        order={2}
        style={{
          color: "#fff",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        🌟 Stock Monitoring Dashboard 🌟
      </Title>

      <Group
        gap="md"
        align="center"
        style={{
          marginBottom: "2rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Select
          label="Store Chain"
          placeholder="Select a store chain"
          value={filters.storeChainId ? String(filters.storeChainId) : null}
          data={
            storeChains?.map((chain) => ({
              value: String(chain.id),
              label: chain.name,
            })) ?? []
          }
          onChange={(value) => handleFilterChange("storeChainId", value)}
          styles={{
            dropdown: {
              background: "rgba(255, 255, 255, 0.9)",
              color: "black",
            },
            input: {
              background: "rgba(255, 255, 255, 0.9)",
              color: "black",
            },
          }}
        />
        <Select
          label="Store"
          placeholder="Select a store"
          value={filters.storeId ? String(filters.storeId) : null}
          data={
            stores
              ?.filter((store) => store.storeChainId === filters.storeChainId)
              ?.map((store) => ({
                value: String(store.id),
                label: store.name,
              })) ?? []
          }
          onChange={(value) => handleFilterChange("storeId", value)}
          disabled={!filters.storeChainId}
          styles={{
            dropdown: {
              background: "rgba(255, 255, 255, 0.9)",
              color: "black",
            },
            input: {
              background: "rgba(255, 255, 255, 0.9)",
              color: "black",
            },
          }}
        />
        <Select
          label="Product"
          placeholder="Select a product"
          value={filters.productId ? String(filters.productId) : null}
          data={
            products
              ?.filter((product) => product.storeId === filters.storeId)
              ?.map((product) => ({
                value: String(product.id),
                label: product.name,
              })) ?? []
          }
          onChange={(value) => handleFilterChange("productId", value)}
          disabled={!filters.storeId}
          styles={{
            dropdown: {
              background: "rgba(255, 255, 255, 0.9)",
              color: "black",
            },
            input: {
              background: "rgba(255, 255, 255, 0.9)",
              color: "black",
            },
          }}
        />
        <Button
          color="gray"
          variant="outline"
          onClick={resetFilters}
          style={{
            borderColor: "#fff",
            color: "#fff",
            alignSelf: "center",
          }}
        >
          Reset Filters
        </Button>
      </Group>

      <ScrollArea
        style={{
          maxHeight: "500px",
          borderRadius: "8px",
          background: "rgba(0, 0, 0, 0.2)",
          padding: "1rem",
          overflowY: "auto",
        }}
        styles={{
          scrollbar: {
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 255, 255, 0.5)",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgba(255, 255, 255, 0.8)",
            },
          },
        }}
      >
        {isLoading ? (
          <LoadingOverlay visible={true} />
        ) : stockData && stockData.length > 0 ? (
          <Flex wrap="wrap" gap="lg" justify="center">
            {stockData.map((item) => (
              <Card
                key={item.id}
                shadow="lg"
                padding="lg"
                radius="md"
                style={{
                  background: "linear-gradient(to bottom, #8B0000, #4B0000)",
                  color: "#fff",
                  width: "250px",
                  minHeight: "250px",
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                }}
              >
                <Text size="lg" weight={700}>
                  {item.productName}
                </Text>
                <Badge
                  color="blue"
                  variant="filled"
                  mt="sm"
                  style={{ fontSize: "14px" }}
                >
                  {item.category}
                </Badge>
                <Text size="sm" color="white" mt="sm">
                  Quantity: <strong>{item.quantity}</strong>
                </Text>
                <Text size="sm" color="white">
                  Price: <strong>${item.price.toFixed(2)}</strong>
                </Text>
                <Text size="sm" color="white">
                  Store: <strong>{item.storeName}</strong>
                </Text>
                <Text size="sm" color="white">
                  Store Chain: <strong>{item.storeChainName}</strong>
                </Text>
              </Card>
            ))}
          </Flex>
        ) : (
          <Text color="dimmed" className="text-center">
            No products available for the selected filters.
          </Text>
        )}
      </ScrollArea>
    </Box>
  );
};

export default StockMonitoring;
