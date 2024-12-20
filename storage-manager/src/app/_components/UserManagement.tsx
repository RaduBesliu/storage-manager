"use client";

import React, { useState } from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "../_components/Navbar";
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
import { useSession } from "next-auth/react";

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "blue",
  STORE_ADMIN: "cyan",
  STORE_EMPLOYEE: "pink",
};

export const UserManagement: React.FC = () => {
  const session = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingUser, setEditingUser] = useState<any>(null); // Pentru utilizatorul selectat
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

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      role: Role.STORE_EMPLOYEE,
      password: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      email: (value) => (value.length > 0 ? null : "Email is required"),
      password: (value) =>
        !editingUser && value.length === 0 ? "Password is required" : null,
    },
  });

  const handleEdit = (user: any) => {
    setEditingUser(user); // Setează utilizatorul care este editat
    form.setValues({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Parola rămâne goală, nu trebuie reinițializată
    });
    open(); // Deschide modalul
  };

  const handleSubmit = (values: any) => {
    if (editingUser) {
      // Actualizare utilizator
      doUpdateUser.mutate({
        id: editingUser.id, // ID-ul utilizatorului editat
        ...values,
      });
    } else {
      // Creare utilizator nou
      doCreateUser.mutate(values);
    }
    form.reset();
    setEditingUser(null);
    close();
  };

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
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => handleEdit(user)} // Apel pentru editare
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
              setEditingUser(null); 
              form.reset();
              open();
            }}
          >
            <div className="flex items-center gap-1">
              <Text fz="sm" fw={500}>
                Create User
              </Text>
              <IconPlus size={16} stroke={1.5} />
            </div>
          </Button>
        </div>
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
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
          form.reset();
          setEditingUser(null);
          close();
        }}
        title={editingUser ? "Edit User" : "Create User"}
        size="md"
        centered
      >
        <Flex direction="column">
          <form
            onSubmit={form.onSubmit(
              (values) => handleSubmit(values),
              (validationErrors, values, event) => {
                console.log(validationErrors, values, event);
              }
            )}
          >
            <Flex direction="column" gap="md">
              <TextInput
                withAsterisk
                label="Name"
                placeholder="John Doe"
                {...form.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                label="Email"
                placeholder="yours@gmail.com"
                {...form.getInputProps("email")}
              />

              {!editingUser && (
                <TextInput
                  withAsterisk
                  label="Password"
                  placeholder="********"
                  {...form.getInputProps("password")}
                />
              )}

              <NativeSelect
                label="Role"
                data={[
                  { value: Role.STORE_EMPLOYEE, label: "Store Employee" },
                  { value: Role.STORE_ADMIN, label: "Store Admin" },
                  { value: Role.SUPER_ADMIN, label: "Super Admin" },
                ]}
                {...form.getInputProps("role")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">{editingUser ? "Update" : "Submit"}</Button>
              </Group>
            </Flex>
          </form>
        </Flex>
      </Modal>
    </>
  ) : (
    <Text>Please sign in to view this page</Text>
  );
};
