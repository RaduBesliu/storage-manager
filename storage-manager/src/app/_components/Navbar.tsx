import React from "react";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Title } from "@mantine/core";
import { AuthenticationForm } from "./Authentication";

const Navbar = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const buttons = [
    { label: "Users", path: "/" },
    { label: "Store Chains", path: "/storeChain" },
    { label: "Products", path: "/products" },
    { label: "Alerts", path: "/alerts" },
    { label: "Orders", path: "/orders" },
    { label: "Reports", path: "/reports" },
  ];

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Authentication"
        size="lg"
        centered
      >
        <AuthenticationForm onClose={close} />
      </Modal>

      <div className="fixed top-0 left-0 h-full w-64 bg-transparent flex flex-col border-r border-gray-500">
        <div className="text-center py-6 border-b border-gray-500">
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">
            Dashboard
          </h3>
        </div>

        <div className="flex flex-col mt-8 px-6 space-y-4">
          {buttons.map((button) => (
            <Link
              href={button.path}
              key={button.label}
              className="px-4 py-3 text-white text-lg font-semibold border border-white rounded-lg shadow-md hover:bg-white hover:text-gray-900 transition duration-200"
            >
              {button.label}
            </Link>
          ))}
        </div>
        <div className="flex-grow" />

        <div className="px-6 mb-6">
          <button
            onClick={open} 
            className="w-full px-4 py-3 text-white text-lg font-semibold border border-red-500 rounded-lg shadow-md hover:bg-red-500 hover:text-white transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
