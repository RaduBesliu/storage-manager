"use client";

import React, { useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Flex,
  Group,
  Modal,
  NativeSelect,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "~/trpc/react";
import { Role } from "@prisma/client";

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "blue",
  STORE_ADMIN: "cyan",
  STORE_EMPLOYEE: "pink",
};

export const UserManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [updateOpened, { open: openUpdate, close: closeUpdate }] =
    useDisclosure(false);
  const utils = api.useUtils();
  const { data: users } = api.user.get.useQuery();
  const doCreateUser = api.user.create.useMutation({
    onSuccess: async () => {
      await utils.user.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doUpdateUser = api.user.update.useMutation({
    onSuccess: async () => {
      await utils.user.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const doDeleteUser = api.user.delete.useMutation({
    onSuccess: async () => {
      await utils.user.get.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const createForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      role: Role.STORE_EMPLOYEE,
      password: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      email: (value) => (value.length > 0 ? null : "Email is required"),
      password: (value) => (value.length > 0 ? null : "Password is required"),
    },
  });

  const updateForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      role: Role.STORE_EMPLOYEE as Role,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      email: (value) => (value.length > 0 ? null : "Email is required"),
    },
  });

  const rows = users?.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {user.name}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge color={roleColors[user.role]} variant="light">
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {user.email}
        </Anchor>
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
              setSelectedUser(user.id);
              updateForm.setValues({
                name: user.name ?? "",
                email: user.email,
                role: user.role,
              });
              openUpdate();
            }}
          >
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              doDeleteUser.mutate({ id: user.id });
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
          <Button variant="subtle" color="teal" onClick={open}>
            <div className="flex items-center gap-1">
              <IconPlus size={16} stroke={1.5} />
              <Text fz="sm" fw={500}>
                Create User
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
                <Table.Th>Employee</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Email</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>

      <Modal
        opened={opened}
        onClose={() => {
          createForm.reset();
          close();
        }}
        title="Create User"
        size="md"
        centered
      >
        <Flex direction="column">
          <form
            onSubmit={createForm.onSubmit(
              (values) => {
                doCreateUser.mutate({
                  name: values.name,
                  email: values.email,
                  role: values.role,
                  password: values.password,
                });

                createForm.reset();
                close();
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
                placeholder="John Doe"
                key={createForm.key("name")}
                {...createForm.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                required
                label="Email"
                placeholder="yours@gmail.com"
                key={createForm.key("email")}
                {...createForm.getInputProps("email")}
              />

              <TextInput
                withAsterisk
                required
                label="Password"
                placeholder="********"
                key={createForm.key("password")}
                {...createForm.getInputProps("password")}
              />

              <NativeSelect
                label="Role"
                key={createForm.key("role")}
                data={[
                  { value: Role.STORE_EMPLOYEE, label: "Store Employee" },
                  { value: Role.STORE_ADMIN, label: "Store Admin" },
                  { value: Role.SUPER_ADMIN, label: "Super Admin" },
                ]}
                {...createForm.getInputProps("role")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
              </Group>
            </Flex>
          </form>
        </Flex>
      </Modal>

      <Modal
        opened={updateOpened}
        onClose={() => {
          updateForm.reset();
          closeUpdate();
        }}
        title="Update User"
        size="md"
        centered
      >
        <Flex direction="column">
          <form
            onSubmit={updateForm.onSubmit(
              (values) => {
                doUpdateUser.mutate({
                  id: selectedUser,
                  name: values.name,
                  email: values.email,
                  role: values.role,
                });

                updateForm.reset();
                closeUpdate();
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
                placeholder="John Doe"
                key={updateForm.key("name")}
                {...updateForm.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                required
                label="Email"
                placeholder="yours@gmail.com"
                key={updateForm.key("email")}
                {...updateForm.getInputProps("email")}
              />

              <NativeSelect
                label="Role"
                key={updateForm.key("role")}
                data={[
                  { value: Role.STORE_EMPLOYEE, label: "Store Employee" },
                  { value: Role.STORE_ADMIN, label: "Store Admin" },
                  { value: Role.SUPER_ADMIN, label: "Super Admin" },
                ]}
                {...updateForm.getInputProps("role")}
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
