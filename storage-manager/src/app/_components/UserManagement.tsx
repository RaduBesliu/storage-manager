"use client";

import React from "react";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Group,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { api } from "~/trpc/react";

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "blue",
  STORE_ADMIN: "cyan",
  STORE_EMPLOYEE: "pink",
};

export const UserManagement: React.FC = () => {
  const theme = useMantineTheme();
  const { data: users } = api.user.get.useQuery();

  const rows = users?.map((user) => (
    <Table.Tr key={user.name}>
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
          <ActionIcon variant="subtle" color="gray">
            <IconPencil size={16} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash size={16} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="flex-col">
      <div className="flex justify-end">
        <Button variant="subtle" color="blue">
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
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
};
