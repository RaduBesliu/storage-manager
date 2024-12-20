"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IconBell,
  IconBuildingWarehouse,
  IconLoadBalancer,
  IconLogout,
  IconReport,
  IconShoppingCart,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons-react";
import { Code, Group, Title } from "@mantine/core";
import classes from "./NavBar.module.scss";
import { signOut } from "next-auth/react";
import { cn } from "~/utils/utils";

const data = [
  { link: "/", label: "Users", icon: IconUsers },
  { link: "/storeChain", label: "Store Chains", icon: IconBuildingWarehouse },
  { link: "/", label: "Products", icon: IconShoppingCart },
  { link: "/", label: "Alerts", icon: IconBell },
  { link: "/", label: "Orders", icon: IconTruckDelivery },
  { link: "/", label: "Reports", icon: IconReport },
];

export const SuperAdminNavBar: React.FC = () => {
  const [active, setActive] = useState("Users");

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={cn(classes.header, "w-max justify-between")}>
          <IconLoadBalancer size={28} stroke={1.5} />
          <Title order={5}>Storage Manager</Title>
          <Code fw={700}>v1.0.0</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <Link
          href="#"
          className={classes.link}
          onClick={() => {
            void signOut();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
};
