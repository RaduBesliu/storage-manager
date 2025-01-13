import React from "react";
import { auth } from "~/server/auth";
import { Role } from "@prisma/client";
import { SuperAdminNavBar } from "./SuperAdminNavBar";
import { StoreAdminNavBar } from "./StoreAdminNavBar";
import { StoreEmployeeNavBar } from "./StoreEmployeeNavBar";

export const NavBar: React.FC = async () => {
  const session = await auth();

  switch (session?.user?.role) {
    case Role.SUPER_ADMIN:
      return (
        <div className="flex text-white">
          <SuperAdminNavBar />
        </div>
      );
    case Role.STORE_ADMIN:
      return (
        <div className="flex text-white">
          <StoreAdminNavBar />
        </div>
      );
    case Role.STORE_EMPLOYEE:
      return (
        <div className="flex text-white">
          <StoreEmployeeNavBar />
        </div>
      );
    default:
      return <></>;
  }
};
