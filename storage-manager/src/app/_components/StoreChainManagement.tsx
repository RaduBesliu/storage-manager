"use client";

import React, { useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "../_components/Navbar";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export const StoreChainManagement: React.FC = () => {
  const session = useSession();

  const [editingStoreChain, setEditingStoreChain] = useState<any>(null); // Stare pentru editare
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [storeModalOpened, { open: openStoreModal, close: closeStoreModal }] = useDisclosure(false);

  const utils = api.useUtils();
  const { data: storeChains } = api.storeChain.get.useQuery();
  const { data: stores } = api.store.getByStoreChainId.useQuery({
    storeChainId: editingStoreChain?.id || 0,
  });

  const doCreateStoreChain = api.storeChain.create.useMutation({
    onSuccess: async () => {
      await utils.storeChain.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const doUpdateStoreChain = api.storeChain.update.useMutation({
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

  const form = useForm({
    initialValues: {
      name: "",
      location: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      location: (value) => (value.length > 0 ? null : "Location is required"),
    },
  });

  const handleEdit = (storeChain: any) => {
    setEditingStoreChain(storeChain);
    form.setValues({
      name: storeChain.name,
      location: storeChain.location,
    });
    openCreate();
  };

  const handleSubmit = (values: any) => {
    if (editingStoreChain) {
      // Actualizare Store Chain
      doUpdateStoreChain.mutate({
        id: editingStoreChain.id,
        name: values.name,
        location: values.location,
      });
    } else {
      // Creare Store Chain nou
      doCreateStoreChain.mutate(values);
    }

    form.reset();
    setEditingStoreChain(null);
    closeCreate();
  };

  const storeChainRows = storeChains?.map((storeChain) => (
    <Table.Tr key={storeChain.id}>
      <Table.Td>
        <Group gap="sm">
          <UnstyledButton
            onClick={() => {
              setEditingStoreChain(storeChain);
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
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => handleEdit(storeChain)}
          >
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

  return session.status === "authenticated" ? (
    <>
      <div className="w-60 bg-gray-100">
        <Navbar />
      </div>
      <div className="flex-col">
        <div className="flex justify-end">
          <Button
            variant="subtle"
            color="blue"
            onClick={() => {
              setEditingStoreChain(null);
              form.reset();
              openCreate();
            }}
          >
            <div className="flex items-center gap-1">
              <Text fz="sm" fw={500}>
                {editingStoreChain ? "Edit Store Chain" : "Create Store Chain"}
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
  
        <Modal
          opened={createOpened}
          onClose={() => {
            form.reset();
            setEditingStoreChain(null);
            closeCreate();
          }}
          title={editingStoreChain ? "Edit Store Chain" : "Create Store Chain"}
          size="md"
          centered
        >
          <Flex direction="column">
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Flex direction="column" gap="md">
                <TextInput
                  withAsterisk
                  label="Name"
                  placeholder="Store Chain Name"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  withAsterisk
                  label="Location"
                  placeholder="Store Chain Location"
                  {...form.getInputProps("location")}
                />
                <Group justify="flex-end" mt="md">
                  <Button type="submit">
                    {editingStoreChain ? "Update" : "Create"}
                  </Button>
                </Group>
              </Flex>
            </form>
          </Flex>
        </Modal>
      </div>
    </>
  ) : (
    <Text>Please sign in to view this page</Text>
  );
  
};
