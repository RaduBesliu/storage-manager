import { HydrateClient } from "~/trpc/server";
import { Authentication } from "./_components/Authentication";

export default async function Home() {
  return (
    <HydrateClient>
      <Authentication />
    </HydrateClient>
  );
}
