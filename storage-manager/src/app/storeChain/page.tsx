import { HydrateClient } from "~/trpc/server";
import { StoreChainManagement } from "../_components/StoreChainManagement";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#333333] to-[#dd1818] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <StoreChainManagement />
        </div>
      </main>
    </HydrateClient>
  );
}
