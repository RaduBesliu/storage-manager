// import { HydrateClient } from "~/trpc/server";
// import { StockMonitoring } from "../_components/StockMonitoring";

// export default function StockMonitoringPage() {
//   return (
//     <HydrateClient>
//       <StockMonitoring />
//     </HydrateClient>
//   );
// }
import React from "react";
import StockMonitoring from "~/app/_components/StockMonitoring";

const StockMonitoringPage = () => {
  return <StockMonitoring />;
};

export default StockMonitoringPage;
