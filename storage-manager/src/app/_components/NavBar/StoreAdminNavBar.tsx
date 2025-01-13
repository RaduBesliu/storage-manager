"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconBell,
  IconLoadBalancer,
  IconLogout,
  IconReport,
  IconShoppingCart,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { Code, Group, Title } from "@mantine/core";
import classes from "./NavBar.module.scss";
import { signOut } from "next-auth/react";
import { cn } from "~/utils/utils";
import { usePathname } from "next/navigation";

const data = [
  { link: "/products", label: "Products", icon: IconShoppingCart },
  { link: "//alerts", label: "Alerts", icon: IconBell },
  { link: "/", label: "Orders", icon: IconTruckDelivery },
  { link: "/reports", label: "Reports", icon: IconReport },
];
const validLinks = data.map((item) => item.link);

export const StoreAdminNavBar: React.FC = () => {
  const pathname = usePathname();
  const [active, setActive] = useState("");

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

  useEffect(() => {
    if (validLinks.includes(pathname)) {
      setActive(data.find((item) => item.link === pathname)?.label ?? "");
    }
  }, [pathname]);

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={cn(classes.header, "w-max justify-between")}>
          <IconLoadBalancer size={28} stroke={1.5} />
          <Title order={5}>
            <Link
              href="/"
              onClick={() => {
                setActive("");
              }}
            >
              Storage Manager
            </Link>
          </Title>
          <Code fw={700}>v1.0.0</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <Link
          href="#"
          className={classes.link}
          onClick={() => {
            void signOut({ redirectTo: "/" });
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
};
