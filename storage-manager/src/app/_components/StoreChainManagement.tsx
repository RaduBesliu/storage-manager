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
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [storeModalOpened, { open: openStoreModal, close: closeStoreModal }] =
    useDisclosure(false);
  const [
    storeCreateOpened,
    { open: openStoreCreate, close: closeStoreCreate },
  ] = useDisclosure(false);
  const modalStack = useModalsStack([
    "store-manager-page",
    "create-store-page",
  ]);
  const utils = api.useUtils();
  const { data: storeChains } = api.storeChain.get.useQuery();
  const { data: stores } = api.store.getByStoreChainId.useQuery({
    storeChainId: selectedStoreChain,
  });
  const doCreateStoreChain = api.storeChain.create.useMutation({
    onSuccess: async () => {
      await utils.storeChain.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doDeleteStoreChain = api.storeChain.delete.useMutation({
    onSuccess: async () => {
      await utils.storeChain.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const doCreateStore = api.store.create.useMutation({
    onSuccess: async () => {
      await utils.store.getByStoreChainId.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doDeleteStore = api.store.delete.useMutation({
    onSuccess: async () => {
      await utils.store.getByStoreChainId.invalidate();
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
            <Text fz="sm" fw={500}>
              {storeChain.name}
            </Text>
          </UnstyledButton>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text fz="sm" fw={500}>
          {storeChain.location}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              doDeleteStoreChain.mutate({ id: storeChain.id });
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
        <Group gap="sm">
          <UnstyledButton onClick={openStoreModal}>
            <Text fz="sm" fw={500}>
              {store.name}
            </Text>
          </UnstyledButton>
        </Group>
      </Table.Td>

      <Table.Td>
        <Text fz="sm" fw={500}>
          {store.location}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              doDeleteStore.mutate({ id: store.id });
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

  const StoreCreateModal = () => (
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
              label="Name"
              placeholder="Store Name"
              key={storeCreateForm.key("name")}
              {...storeCreateForm.getInputProps("name")}
            />

            <TextInput
              withAsterisk
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
  );

  return (
    <>
      <div className="flex-col">
        <div className="flex justify-end">
          <Button variant="subtle" color="blue" onClick={openCreate}>
            <div className="flex items-center gap-1">
              <Text fz="sm" fw={500}>
                Create Store Chain
              </Text>
              <IconPlus size={16} stroke={1.5} />
            </div>
          </Button>
        </div>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
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
                withAsterisk
                label="Name"
                placeholder="Store Chain Name"
                key={createForm.key("name")}
                {...createForm.getInputProps("name")}
              />

              <TextInput
                withAsterisk
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
            <Button variant="subtle" color="blue" onClick={openStoreCreate}>
              <div className="flex items-center gap-1">
                <Text fz="sm" fw={500}>
                  Create Store
                </Text>
                <IconPlus size={16} stroke={1.5} />
              </div>
            </Button>
          </div>
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm">
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
        </Modal>

        <StoreCreateModal />
      </Modal.Stack>
    </>
  );
};
