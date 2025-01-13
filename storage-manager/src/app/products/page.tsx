import { HydrateClient } from "~/trpc/server";
import { ProductsManagement } from "../_components/ProductsManagement";

export default async function Products() {
  return (
    <HydrateClient>
      <ProductsManagement />
    </HydrateClient>
  );
}
