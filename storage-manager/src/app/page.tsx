import { HydrateClient } from "~/trpc/server";
import { UserManagement } from "./_components/UserManagement";
import { Authentication } from "./_components/Authentication";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333333] to-[#dd1818] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <Authentication />
          {/* <UserManagement /> */}
        </div>
      </main>
    </HydrateClient>
  );
}
