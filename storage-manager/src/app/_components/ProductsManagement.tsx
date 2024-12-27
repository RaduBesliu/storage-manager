"use client";

import React, { useEffect, useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  NativeSelect,
  NumberInput,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "~/trpc/react";

export const ProductsManagement: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const utils = api.useUtils();
  const { data: stores } = api.store.get.useQuery();
  const { data: products } = api.product.get.useQuery();

  const doCreateProduct = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doEditProduct = api.product.edit.useMutation({
    onSuccess: async () => {
      await utils.product.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doDeleteProduct = api.product.delete.useMutation({
    onSuccess: async () => {
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
      storeId: 0,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      category: (value) => (value.length > 0 ? null : "Category is required"),
      price: (value) => (value > 0 ? null : "Price is required"),
      quantity: (value) => (value > 0 ? null : "Quantity is required"),
      storeId: (value) => (value !== 0 ? null : "Store is required"),
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
      storeId: 0,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      category: (value) => (value.length > 0 ? null : "Category is required"),
      price: (value) => (value > 0 ? null : "Price is required"),
      quantity: (value) => (value > 0 ? null : "Quantity is required"),
      storeId: (value) => (value !== 0 ? null : "Store is required"),
    },
  });

  useEffect(() => {
    if (stores && stores?.length > 0 && createForm.getValues().storeId === 0) {
      createForm.setFieldValue("storeId", stores[0]!.id);
    }
  }, [createForm, stores]);

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
                storeId: product.storeId,
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
              doDeleteProduct.mutate({ id: product.id });
            }}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="flex flex-col gap-2">
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
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
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
                  storeId: values.storeId,
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

              <NativeSelect
                withAsterisk
                required
                label="Store"
                data={stores?.map((store) => ({
                  label: store.name,
                  value: store.id.toString(),
                }))}
                {...createForm.getInputProps("storeId")}
                onChange={(event) => {
                  createForm.setFieldValue(
                    "storeId",
                    parseInt(event.target.value),
                  );
                }}
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
                  storeId: values.storeId,
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
                onChange={(event) => {
                  editForm.setFieldValue(
                    "storeId",
                    parseInt(event.target.value),
                  );
                }}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </Flex>
          </form>
        </Flex>
      </Modal>
    </>
  );
};
