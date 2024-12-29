import { HydrateClient } from "~/trpc/server";
import { ReportsManagement } from "../_components/Reports/ReportsManagement";

export default async function Reports() {
  return (
    <HydrateClient>
      <ReportsManagement />
    </HydrateClient>
  );
}
