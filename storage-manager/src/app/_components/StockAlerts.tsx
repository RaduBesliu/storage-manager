"use client";

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Flex, Tabs } from "@mantine/core";
import {
  Button,
  Table,
  Group,
  Select,
  NumberInput,
  Switch,
  LoadingOverlay,
  Box,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Notifications } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";

const StockAlerts = () => {
  const [newAlert, setNewAlert] = useState<{
    productId?: number;
    storeId?: number;
    storeChainId?: number;
    threshold: number;
  }>({
    threshold: 0,
  });

  const utils = api.useUtils();
  const { data: products } = api.product.get.useQuery({
    storeId: undefined,
  });
  const { data: storeChains } = api.storeChain.get.useQuery();
  const { data: stores } = api.store.get.useQuery();
  const { data: alerts } = api.alert.getActiveAlerts.useQuery();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const { data: alertHistory } = api.alert.getAlertHistory.useQuery();

  const createAlert = api.alert.create.useMutation({
    onSuccess: async (data) => {
      await utils.alert.invalidate();

      setNewAlert({
        threshold: 0,
      });

      showNotification({
        title: "Success",
        message: data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: () => {
      showNotification({
        title: "Error",
        message: "Failed to create alert.",
        color: "red",
        icon: <X />,
      });
    },
  });

  const toggleAlert = api.alert.toggleAlert.useMutation({
    onSuccess: async (data) => {
      await utils.alert.invalidate();

      showNotification({
        title: "Success",
        message: data.message,
        color: "green",
        icon: <Check />,
      });
    },
    onError: () => {
      showNotification({
        title: "Error",
        message: "Failed to update alert.",
        color: "red",
        icon: <X />,
      });
    },
  });

  return (
    <Box
      p="md"
      style={{
        background: "transparent",
        padding: "2rem",
      }}
    >
      <Notifications position="top-right" />
      <Title
        order={2}
        style={{
          color: "#fff",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Stock Alerts Management
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
          label="Product"
          data={
            products?.map((p) => ({ value: String(p.id), label: p.name })) ?? []
          }
          value={newAlert.productId ? newAlert.productId.toString() : null}
          onChange={(value) =>
            setNewAlert({
              ...newAlert,
              productId: value ? parseInt(value, 10) : undefined,
            })
          }
        />
        <Select
          label="Store Chain"
          data={
            storeChains?.map((sc) => ({
              value: String(sc.id),
              label: sc.name,
            })) ?? []
          }
          value={
            newAlert.storeChainId ? newAlert.storeChainId.toString() : null
          }
          onChange={(value) =>
            setNewAlert({
              ...newAlert,
              storeChainId: value ? parseInt(value, 10) : undefined,
              storeId: undefined,
            })
          }
          allowDeselect
        />
        <Select
          label="Store"
          data={
            stores
              ?.filter((s) => s.storeChainId === newAlert.storeChainId)
              ?.map((s) => ({ value: String(s.id), label: s.name })) ?? []
          }
          value={newAlert.storeId ? newAlert.storeId.toString() : null}
          onChange={(value) =>
            setNewAlert({
              ...newAlert,
              storeId: value ? parseInt(value, 10) : undefined,
            })
          }
          disabled={!newAlert.storeChainId}
        />
        <NumberInput
          label="Threshold"
          value={newAlert.threshold}
          onChange={(value) =>
            setNewAlert({
              ...newAlert,
              threshold: value ? parseInt(value as string, 10) : 0,
            })
          }
        />

        <Flex justify="end">
          <Button
            onClick={() =>
              newAlert.productId &&
              newAlert.threshold &&
              createAlert.mutate({
                productId: newAlert.productId,
                storeId: newAlert.storeId ?? undefined,
                storeChainId: newAlert.storeChainId ?? undefined,
                threshold: newAlert.threshold,
              })
            }
            disabled={!newAlert.productId}
          >
            Add Alert
          </Button>
        </Flex>
      </Group>

      <Box
        style={{
          overflowX: "auto",
          margin: "0 auto",
          maxWidth: "1000px",
          borderRadius: "8px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
          background: "rgba(255, 255, 255, 0.1)",
          padding: "1rem",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value as "active" | "history")}
          mt="lg"
        >
          <Tabs.List>
            <Tabs.Tab value="active">Active Alerts</Tabs.Tab>
            <Tabs.Tab value="history">Alert History</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active">
            <Box>
              <Table
                mt="md"
                style={{ borderCollapse: "collapse", width: "100%" }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #8B0000" }}>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Product
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Store
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Store Chain
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Threshold
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Status
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alerts?.map((alert) => (
                    <tr
                      key={alert.id}
                      style={{ borderBottom: "1px solid #8B0000" }}
                    >
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.Product.name}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.Store?.name ?? "-"}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.StoreChain?.name ?? "-"}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.threshold}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        <Switch
                          checked={alert.isActive}
                          onChange={(e) =>
                            toggleAlert.mutate({
                              alertId: alert.id,
                              isActive: e.target.checked,
                            })
                          }
                        />
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        -
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Tabs.Panel>

          <Tabs.Panel value="history">
            <Box>
              <Table
                mt="md"
                style={{ borderCollapse: "collapse", width: "100%" }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #8B0000" }}>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Product
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Store
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Store Chain
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Threshold
                    </th>
                    <th style={{ padding: "8px", border: "1px solid #8B0000" }}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alertHistory?.map((alert) => (
                    <tr
                      key={alert.id}
                      style={{ borderBottom: "1px solid #8B0000" }}
                    >
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.Product.name}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.Store?.name ?? "-"}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.StoreChain?.name ?? "-"}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {alert.threshold}
                      </td>
                      <td
                        style={{ padding: "8px", border: "1px solid #8B0000" }}
                      >
                        {new Date(alert.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Box>

      <LoadingOverlay
        visible={createAlert.isPending || toggleAlert.isPending}
      />
    </Box>
  );
};

export default StockAlerts;
