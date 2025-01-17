"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  NativeSelect,
  NumberInput,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "~/trpc/react";
import { Event } from "~/utils/types";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export const ProductsManagement: React.FC = () => {
  const session = useSession();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const { ref, inView } = useInView({
    root: tableRef.current,
    threshold: 1.0, // Trigger when the element is fully in view
  });

  const [selectedProduct, setSelectedProduct] = useState(0);
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [
    confirmDeleteOpened,
    { open: openConfirmDelete, close: closeConfirmDelete },
  ] = useDisclosure(false);
  const utils = api.useUtils();
  const { data: stores } = api.store.get.useQuery();
  const {
    data: productsData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.product.getInfinite.useInfiniteQuery(
    {
      limit: 20,
      storeId: session.data?.user?.storeId ?? undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );
  const products = useMemo(
    () => productsData?.pages.flatMap((page) => page.items) ?? [],
    [productsData],
  );

  const doCreateProduct = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.getInfinite.invalidate();
      await utils.product.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doEditProduct = api.product.edit.useMutation({
    onSuccess: async () => {
      await utils.product.getInfinite.invalidate();
      await utils.product.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doDeleteProduct = api.product.delete.useMutation({
    onSuccess: async () => {
      await utils.product.getInfinite.invalidate();
      await utils.product.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const createForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      quantity: 0,
      storeId: "-1" as string | null,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      category: (value) => (value.length > 0 ? null : "Category is required"),
      price: (value) => (value > 0 ? null : "Price is required"),
      quantity: (value) => (value > 0 ? null : "Quantity is required"),
      storeId: (value) => (value ? null : "Store is required"),
    },
  });

  const editForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      category: "",
      description: "",
      price: 0,
      quantity: 0,
      storeId: "-1" as string | null,
      details: "",
      operationType: Event.ADJUSTMENT,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      category: (value) => (value.length > 0 ? null : "Category is required"),
      price: (value) => (value > 0 ? null : "Price is required"),
      quantity: (value) => (value > 0 ? null : "Quantity is required"),
      storeId: (value) => (value ? null : "Store is required"),
      operationType: (value) =>
        value.length > 0 ? null : "Operation type is required",
    },
  });

  useEffect(() => {
    if (
      stores &&
      stores?.length > 0 &&
      createForm.getValues().storeId === "-1"
    ) {
      createForm.setFieldValue("storeId", stores[0]!.id.toString());
    }
  }, [createForm, stores]);

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const rows = products?.map((product) => (
    <Table.Tr key={product.id}>
      <Table.Td>
        <Text c="teal.3">{product.name}</Text>
      </Table.Td>
      <Table.Td>
        <Text c="pink.3">{product.category}</Text>{" "}
      </Table.Td>
      <Table.Td>
        <Text c="blue.3">{product.price}</Text>
      </Table.Td>
      <Table.Td>
        <Text c="lime.6">{product.quantity}</Text>
      </Table.Td>
      <Table.Td>
        <Text c="gray.4">
          {stores?.find((store) => store.id === product.storeId)?.name ?? ""}
        </Text>
      </Table.Td>
      {session.data?.user?.role !== Role.STORE_EMPLOYEE ? (
        <Table.Td
          classNames={{
            td: "flex justify-end",
          }}
        >
          <Group gap={0} justify="flex-end">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => {
                setSelectedProduct(product.id);
                editForm.setValues({
                  name: product.name,
                  category: product.category,
                  description: product.description,
                  price: product.price,
                  quantity: product.quantity,
                  storeId: product.storeId.toString(),
                });
                openEdit();
              }}
            >
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => {
                setSelectedProduct(product.id);
                openConfirmDelete();
              }}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
      ) : null}
    </Table.Tr>
  ));

  return (
    <>
      <div className="flex h-screen flex-col gap-2 py-10">
        {session.data?.user?.role !== Role.STORE_EMPLOYEE ? (
          <div className="flex justify-end">
            <Button variant="subtle" color="teal" onClick={openCreate}>
              <div className="flex items-center gap-1">
                <IconPlus size={16} stroke={1.5} />
                <Text fz="sm" fw={500}>
                  Add Product
                </Text>
              </div>
            </Button>
          </div>
        ) : null}
        <ScrollArea style={{ flex: 1, overflow: "auto" }} ref={tableRef}>
          <Table.ScrollContainer minWidth={800}>
            <Table
              highlightOnHover
              highlightOnHoverColor="#fcc41940"
              verticalSpacing="md"
              className="text-white"
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Store Name</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows}
                {hasNextPage && (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <div ref={ref}>
                        <Flex align="center" justify="center">
                          {isFetchingNextPage ? (
                            <Loader color="white" type="dots" />
                          ) : null}
                        </Flex>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </ScrollArea>
      </div>

      <Modal
        opened={createOpened}
        onClose={() => {
          createForm.reset();
          closeCreate();
        }}
        title="Add Product"
        size="md"
        centered
      >
        <Flex direction="column">
          <form
            onSubmit={createForm.onSubmit(
              (values) => {
                doCreateProduct.mutate({
                  name: values.name,
                  category: values.category,
                  description: values.description,
                  price: values.price,
                  quantity: values.quantity,
                  storeId: values.storeId ? parseInt(values.storeId) : 0,
                });

                createForm.reset();
                closeCreate();
              },
              (validationErrors, values, event) => {
                console.log(
                  validationErrors, // <- form.errors at the moment of submit
                  values, // <- form.getValues() at the moment of submit
                  event, // <- form element submit event
                );
              },
            )}
          >
            <Flex direction="column" gap="md">
              <TextInput
                data-autofocus
                required
                withAsterisk
                label="Name"
                placeholder="Product name"
                key={createForm.key("name")}
                {...createForm.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                required
                label="Category"
                placeholder="Product category"
                key={createForm.key("category")}
                {...createForm.getInputProps("category")}
              />

              <TextInput
                label="Description"
                placeholder="Product description"
                key={createForm.key("description")}
                {...createForm.getInputProps("description")}
              />

              <NumberInput
                withAsterisk
                required
                label="Price"
                placeholder="Product price"
                key={createForm.key("price")}
                {...createForm.getInputProps("price")}
              />

              <NumberInput
                withAsterisk
                required
                label="Quantity"
                placeholder="Product quantity"
                key={createForm.key("quantity")}
                {...createForm.getInputProps("quantity")}
              />

              <Select
                withAsterisk
                required
                label="Store"
                allowDeselect={false}
                data={stores?.map((store) => ({
                  label: store.name,
                  value: store.id.toString(),
                }))}
                {...createForm.getInputProps("storeId")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </Flex>
          </form>
        </Flex>
      </Modal>

      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          closeEdit();
        }}
        title="Edit Product"
        size="md"
        centered
      >
        <Flex direction="column">
          <form
            onSubmit={editForm.onSubmit(
              (values) => {
                doEditProduct.mutate({
                  id: selectedProduct,
                  name: values.name,
                  category: values.category,
                  description: values.description,
                  price: values.price,
                  quantity: values.quantity,
                  storeId: values.storeId ? parseInt(values.storeId) : 0,
                  details: values.details,
                  operationType: values.operationType,
                });

                editForm.reset();
                closeEdit();
              },
              (validationErrors, values, event) => {
                console.log(
                  validationErrors, // <- form.errors at the moment of submit
                  values, // <- form.getValues() at the moment of submit
                  event, // <- form element submit event
                );
              },
            )}
          >
            <Flex direction="column" gap="md">
              <TextInput
                data-autofocus
                required
                withAsterisk
                label="Name"
                placeholder="Product name"
                key={editForm.key("name")}
                {...editForm.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                required
                label="Category"
                placeholder="Product category"
                key={editForm.key("category")}
                {...editForm.getInputProps("category")}
              />

              <TextInput
                label="Description"
                placeholder="Product description"
                key={editForm.key("description")}
                {...editForm.getInputProps("description")}
              />

              <NumberInput
                withAsterisk
                required
                label="Price"
                placeholder="Product price"
                key={editForm.key("price")}
                {...editForm.getInputProps("price")}
              />

              <NumberInput
                withAsterisk
                required
                label="Quantity"
                placeholder="Product quantity"
                key={editForm.key("quantity")}
                {...editForm.getInputProps("quantity")}
              />

              <NativeSelect
                withAsterisk
                required
                label="Store"
                data={stores?.map((store) => ({
                  label: store.name,
                  value: store.id.toString(),
                }))}
                {...editForm.getInputProps("storeId")}
              />

              <TextInput
                label="Details"
                placeholder={"Reason for edit or supplier details"}
                key={editForm.key("details")}
                {...editForm.getInputProps("details")}
              />

              <NativeSelect
                withAsterisk
                required
                label="Operation type"
                data={Object.values(Event).map((event) => ({
                  label: event as string,
                  value: event as string,
                }))}
                {...editForm.getInputProps("operationType")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </Flex>
          </form>
        </Flex>
      </Modal>

      <Modal
        opened={confirmDeleteOpened}
        onClose={closeConfirmDelete}
        title="Confirm Delete"
        size="sm"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Flex direction="column" gap="md">
          <Text>Are you sure you want to delete this product?</Text>
          <Group justify="flex-end">
            <Button
              color="red"
              onClick={() => {
                doDeleteProduct.mutate({ id: selectedProduct });
                closeConfirmDelete();
              }}
            >
              Delete
            </Button>
          </Group>
        </Flex>
      </Modal>
    </>
  );
};
