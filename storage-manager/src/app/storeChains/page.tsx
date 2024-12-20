import { HydrateClient } from "~/trpc/server";
import { StoreChainManagement } from "../_components/StoreChainManagement";

export default function StoreChains() {
  return (
    <HydrateClient>
      <StoreChainManagement />
    </HydrateClient>
  );
}
