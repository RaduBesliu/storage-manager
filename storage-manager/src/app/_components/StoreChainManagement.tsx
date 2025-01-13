"use client";

import React, { useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  useModalsStack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "~/trpc/react";

export const StoreChainManagement: React.FC = () => {
  const [selectedStoreChain, setSelectedStoreChain] = useState(0);
  const [selectedStore, setSelectedStore] = useState(0);
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [
    confirmDeleteStoreChainOpened,
    { open: openConfirmDeleteStoreChain, close: closeConfirmDeleteStoreChain },
  ] = useDisclosure(false);
  const [
    confirmDeleteStoreOpened,
    { open: openConfirmDeleteStore, close: closeConfirmDeleteStore },
  ] = useDisclosure(false);
  const [storeModalOpened, { open: openStoreModal, close: closeStoreModal }] =
    useDisclosure(false);
  const [
    storeCreateOpened,
    { open: openStoreCreate, close: closeStoreCreate },
  ] = useDisclosure(false);
  const [storeEditOpened, { open: openStoreEdit, close: closeStoreEdit }] =
    useDisclosure(false);

  const modalStack = useModalsStack([
    "store-manager-page",
    "create-store-page",
    "edit-store-page",
    "confirm-delete-store-chain-page",
    "confirm-delete-store-page",
  ]);

  const utils = api.useUtils();
  const { data: storeChains } = api.storeChain.get.useQuery();
  const { data: stores } = api.store.getByStoreChainId.useQuery({
    storeChainId: selectedStoreChain,
  });

  const doCreateStoreChain = api.storeChain.create.useMutation({
    onSuccess: async () => {
      await utils.storeChain.invalidate();
      await utils.store.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doEditStoreChain = api.storeChain.update.useMutation({
    onSuccess: async () => {
      await utils.storeChain.invalidate();
      await utils.store.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doDeleteStoreChain = api.storeChain.delete.useMutation({
    onSuccess: async () => {
      await utils.storeChain.invalidate();
      await utils.store.invalidate();
      await utils.product.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const doCreateStore = api.store.create.useMutation({
    onSuccess: async () => {
      await utils.store.invalidate();
      await utils.product.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doEditStore = api.store.update.useMutation({
    onSuccess: async () => {
      await utils.store.invalidate();
      await utils.product.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doDeleteStore = api.store.delete.useMutation({
    onSuccess: async () => {
      await utils.store.invalidate();
      await utils.product.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const createForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      location: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      location: (value) => (value.length > 0 ? null : "Location is required"),
    },
  });

  const editForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      location: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      location: (value) => (value.length > 0 ? null : "Location is required"),
    },
  });

  const storeChainRows = storeChains?.map((storeChain) => (
    <Table.Tr key={storeChain.id}>
      <Table.Td>
        <Group gap="sm">
          <UnstyledButton
            onClick={() => {
              setSelectedStoreChain(storeChain.id);
              openStoreModal();
            }}
          >
            <Text fz="sm" fw={500} c="teal.3">
              {storeChain.name}
            </Text>
          </UnstyledButton>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text fz="sm" fw={500} c="blue.3">
          {storeChain.location}
        </Text>
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
              setSelectedStoreChain(storeChain.id);
              editForm.setValues({
                name: storeChain.name,
                location: storeChain.location,
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
              setSelectedStoreChain(storeChain.id);
              openConfirmDeleteStoreChain();
            }}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const storeRows = stores?.map((store) => (
    <Table.Tr key={store.id}>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {store.name}
        </Text>
      </Table.Td>

      <Table.Td>
        <Text fz="sm" fw={500}>
          {store.location}
        </Text>
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
              setSelectedStore(store.id);
              storeEditForm.setValues({
                name: store.name,
                location: store.location,
              });
              openStoreEdit();
            }}
          >
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              setSelectedStore(store.id);
              openConfirmDeleteStore();
            }}
          >
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const storeCreateForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      location: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      location: (value) => (value.length > 0 ? null : "Location is required"),
    },
  });

  const storeEditForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      location: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      location: (value) => (value.length > 0 ? null : "Location is required"),
    },
  });

  return (
    <>
      <div className="flex h-screen flex-col gap-2 py-10">
        <div className="flex justify-end">
          <Button variant="subtle" color="teal" onClick={openCreate}>
            <div className="flex items-center gap-1">
              <IconPlus size={16} stroke={1.5} />
              <Text fz="sm" fw={500}>
                Create Store Chain
              </Text>
            </div>
          </Button>
        </div>
        <ScrollArea style={{ flex: 1, overflow: "auto" }}>
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
                  <Table.Th>Location</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{storeChainRows}</Table.Tbody>
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
        title="Create Store Chain"
        size="md"
        centered
      >
        <Flex direction="column">
          <form
            onSubmit={createForm.onSubmit(
              (values) => {
                doCreateStoreChain.mutate({
                  name: values.name,
                  location: values.location,
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
                withAsterisk
                required
                label="Name"
                placeholder="Store Chain Name"
                key={createForm.key("name")}
                {...createForm.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                required
                label="Location"
                placeholder="Store Chain Location"
                key={createForm.key("location")}
                {...createForm.getInputProps("location")}
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
        title="Edit Store Chain"
        size="md"
        centered
      >
        <Flex direction="column">
          <form
            onSubmit={editForm.onSubmit(
              (values) => {
                doEditStoreChain.mutate({
                  id: selectedStoreChain,
                  name: values.name,
                  location: values.location,
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
                withAsterisk
                required
                label="Name"
                placeholder="Store Chain Name"
                key={editForm.key("name")}
                {...editForm.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                required
                label="Location"
                placeholder="Store Chain Location"
                key={editForm.key("location")}
                {...editForm.getInputProps("location")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </Flex>
          </form>
        </Flex>
      </Modal>

      <Modal.Stack>
        <Modal
          {...modalStack.register("store-manager-page")}
          opened={storeModalOpened}
          onClose={() => {
            closeStoreModal();
          }}
          title="Store Manager"
          fullScreen
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <div className="flex justify-end">
            <Button variant="subtle" color="teal" onClick={openStoreCreate}>
              <div className="flex items-center gap-1">
                <IconPlus size={16} stroke={1.5} />
                <Text fz="sm" fw={500}>
                  Create Store
                </Text>
              </div>
            </Button>
          </div>
          <ScrollArea style={{ flex: 1, overflow: "auto" }}>
            <Table.ScrollContainer minWidth={800}>
              <Table highlightOnHover verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{storeRows}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </ScrollArea>
        </Modal>

        <Modal
          {...modalStack.register("create-store-page")}
          opened={storeCreateOpened}
          onClose={() => {
            storeCreateForm.reset();
            closeStoreCreate();
          }}
          title="Create Store"
          size="lg"
          centered
          overlayProps={{
            backgroundOpacity: 0.45,
            blur: 5,
          }}
        >
          <Flex direction="column">
            <form
              onSubmit={storeCreateForm.onSubmit(
                (values) => {
                  doCreateStore.mutate({
                    name: values.name,
                    location: values.location,
                    storeChainId: selectedStoreChain,
                  });

                  storeCreateForm.reset();
                  closeStoreCreate();
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
                  withAsterisk
                  required
                  label="Name"
                  placeholder="Store Name"
                  key={storeCreateForm.key("name")}
                  {...storeCreateForm.getInputProps("name")}
                />

                <TextInput
                  withAsterisk
                  required
                  label="Location"
                  placeholder="Store Location"
                  key={storeCreateForm.key("location")}
                  {...storeCreateForm.getInputProps("location")}
                />

                <Group justify="flex-end" mt="md">
                  <Button type="submit">Submit</Button>
                </Group>
              </Flex>
            </form>
          </Flex>
        </Modal>

        <Modal
          {...modalStack.register("edit-store-page")}
          opened={storeEditOpened}
          onClose={() => {
            storeEditForm.reset();
            closeStoreEdit();
          }}
          title="Edit Store"
          size="lg"
          centered
          overlayProps={{
            backgroundOpacity: 0.45,
            blur: 5,
          }}
        >
          <Flex direction="column">
            <form
              onSubmit={storeEditForm.onSubmit(
                (values) => {
                  doEditStore.mutate({
                    id: selectedStore,
                    name: values.name,
                    location: values.location,
                  });

                  storeEditForm.reset();
                  closeStoreEdit();
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
                  withAsterisk
                  required
                  label="Name"
                  placeholder="Store Name"
                  key={storeEditForm.key("name")}
                  {...storeEditForm.getInputProps("name")}
                />

                <TextInput
                  withAsterisk
                  required
                  label="Location"
                  placeholder="Store Location"
                  key={storeEditForm.key("location")}
                  {...storeEditForm.getInputProps("location")}
                />

                <Group justify="flex-end" mt="md">
                  <Button type="submit">Submit</Button>
                </Group>
              </Flex>
            </form>
          </Flex>
        </Modal>

        <Modal
          {...modalStack.register("confirm-delete-store-chain-page")}
          opened={confirmDeleteStoreChainOpened}
          onClose={closeConfirmDeleteStoreChain}
          title="Confirm Delete Store Chain"
          size="sm"
          centered
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <Flex direction="column" gap="md">
            <Text>Are you sure you want to delete this store chain?</Text>
            <Group justify="flex-end">
              <Button
                color="red"
                onClick={() => {
                  doDeleteStoreChain.mutate({ id: selectedStoreChain });
                  closeConfirmDeleteStoreChain();
                }}
              >
                Delete
              </Button>
            </Group>
          </Flex>
        </Modal>

        <Modal
          {...modalStack.register("confirm-delete-store-page")}
          opened={confirmDeleteStoreOpened}
          onClose={closeConfirmDeleteStore}
          title="Confirm Delete Store"
          size="sm"
          centered
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <Flex direction="column" gap="md">
            <Text>Are you sure you want to delete this store?</Text>
            <Group justify="flex-end">
              <Button
                color="red"
                onClick={() => {
                  doDeleteStore.mutate({ id: selectedStore });
                  closeConfirmDeleteStore();
                }}
              >
                Delete
              </Button>
            </Group>
          </Flex>
        </Modal>
      </Modal.Stack>
    </>
  );
};
