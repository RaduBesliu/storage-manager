import React from "react";
import { auth } from "~/server/auth";
import { Role } from "@prisma/client";
import { SuperAdminNavBar } from "./SuperAdminNavBar";

export const NavBar: React.FC = async () => {
  const session = await auth();

  switch (session?.user?.role) {
    case Role.SUPER_ADMIN:
      return (
        <div className="flex text-white">
          <SuperAdminNavBar />
        </div>
      );
    // case Role.STORE_ADMIN:
    //   return <StoreAdminNavBar />;
    // case Role.STORE_EMPLOYEE:
    //   return <StoreEmployeeNavBar />;
    default:
      return <></>;
  }
};
