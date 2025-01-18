import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";
import { format } from "date-fns";
import type {
  AdjustmentReport,
  LowStockAlertReport,
  PriceChangeImpactReport,
  PriceChangeReport,
  ProductReturnRateReport,
  RestockReport,
  ReturnReport,
  SaleReport,
  SalesRevenueTrendReport,
} from "~/utils/types";

export const renderSaleReport = (saleReport: SaleReport[]) => {
  const chartData = saleReport.map((item) => ({
    saleDate: format(new Date(item.saleDate), "MMM dd, yyyy"),
    totalPrice: item.totalPrice,
    quantity: item.quantity,
    storeName: item.Store.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="saleDate" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="totalPrice"
          tick={{ fontSize: 12 }}
          label={{
            value: "Total Sales (RON)",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            offset: -20,
          }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>{data.saleDate}</strong>
                  </p>
                  <p>Total Sales: {data.totalPrice.toFixed(2)} RON</p>
                  <p>Quantity Sold: {data.quantity}</p>
                  <p>Store: {data.storeName}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Line
          type="monotone"
          dataKey="totalPrice"
          name="Total Sales (RON)"
          stroke="orange"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const renderRestockReport = (restockReport: RestockReport[]) => {
  const chartData = restockReport.map((item) => ({
    restockDate: format(new Date(item.restockDate), "MMM dd, yyyy"),
    quantity: item.quantity,
    storeName: item.Store.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="restockDate" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="quantity"
          tick={{ fontSize: 12 }}
          label={{
            value: "Quantity Restocked",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            offset: -20,
          }}
          domain={[0, "dataMax + 1"]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>{data.restockDate}</strong>
                  </p>
                  <p>Quantity Restocked: {data.quantity}</p>
                  <p>Store: {data.storeName}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Bar
          dataKey="quantity"
          name="Quantity Restocked"
          fill="green"
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const renderReturnReport = (returnReport: ReturnReport[]) => {
  const chartData = returnReport.map((item) => ({
    returnDate: format(new Date(item.returnDate), "MMM dd, yyyy"),
    quantity: item.quantity,
    storeName: item.Store.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="returnDate" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="quantity"
          tick={{ fontSize: 12 }}
          label={{
            value: "Quantity Returned",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            offset: -20,
          }}
          domain={[0, "dataMax + 1"]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>{data.returnDate}</strong>
                  </p>
                  <p>Quantity Returned: {data.quantity}</p>
                  <p>Store: {data.storeName}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Bar
          dataKey="quantity"
          name="Quantity Returned"
          fill="red"
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const renderPriceChangeReport = (
  priceChangeReport: PriceChangeReport[],
) => {
  const chartData = priceChangeReport.map((item) => ({
    changeDate: format(new Date(item.changeDate), "MMM dd, yyyy"),
    oldPrice: item.oldPrice,
    newPrice: item.newPrice,
    storeName: item.Store.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="changeDate" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="newPrice"
          tick={{ fontSize: 12 }}
          label={{
            value: "Price (RON)",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            offset: -20,
          }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>{data.changeDate}</strong>
                  </p>
                  <p>Old Price: {data.oldPrice.toFixed(2)} RON</p>
                  <p>New Price: {data.newPrice.toFixed(2)} RON</p>
                  <p>Store: {data.storeName}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Line
          type="monotone"
          dataKey="newPrice"
          name="Price (RON)"
          stroke="brown"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const renderAdjustmentReport = (
  adjustmentReport: AdjustmentReport[],
) => {
  const chartData = adjustmentReport.map((item) => ({
    adjustmentDate: format(new Date(item.adjustmentDate), "MMM dd, yyyy"),
    quantity: item.quantity,
    storeName: item.Store.name,
  }));

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="adjustmentDate" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="quantity"
          tick={{ fontSize: 12 }}
          label={{
            value: "Quantity Adjusted",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            offset: -20,
          }}
          domain={["dataMin - 1", "dataMax + 1"]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>{data.adjustmentDate}</strong>
                  </p>
                  <p>Quantity Adjusted: {data.quantity}</p>
                  <p>Store: {data.storeName}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <ReferenceLine y={0} stroke="#000" />
        <Bar
          dataKey="quantity"
          name="Quantity Adjusted"
          fill="purple"
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// New charts

export const renderLowStockAlertsReport = (
  lowStockAlertsReport: LowStockAlertReport,
) => {
  const chartData = Object.entries(lowStockAlertsReport).map(
    ([category, alerts]) => ({
      category,
      count: alerts.length,
    }),
  );

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
        <Radar
          name="Low Stock Alerts"
          dataKey="count"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>{data.category}</strong>
                  </p>
                  <p>Low Stock Alerts: {data.count}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const renderSalesRevenueTrendsReports = (
  salesRevenueTrendsReport: SalesRevenueTrendReport[],
) => {
  const chartData = salesRevenueTrendsReport.map((item) => ({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    saleDate: format(new Date(item.saleDate), "MMM dd, yyyy"),
    totalPrice: item._sum.totalPrice,
  }));

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="saleDate" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{
            value: "Total Revenue (RON)",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            offset: -20,
          }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>{data.saleDate}</strong>
                  </p>
                  <p>Total Revenue: {data.totalPrice.toFixed(2)} RON</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Area
          type="monotone"
          dataKey="totalPrice"
          name="Total Revenue (RON)"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const renderPriceChangeImpactReport = (
  priceChangeImpactReport: PriceChangeImpactReport[],
) => {
  const chartData = priceChangeImpactReport.map((item) => ({
    reason: item.reason ?? "Unknown",
    count: item._count._all,
  }));

  if (chartData.length === 1) {
    chartData.push({ reason: "Other", count: 10 });
  }

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
    "#19FF19",
    "#1919FF",
    "#FF19FF",
    "#19FFFF",
  ];

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="reason"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label={(entry) => `${entry.reason}: ${entry.count}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const renderProductReturnRatesReport = (
  productReturnRatesReport: ProductReturnRateReport[],
) => {
  const chartData = productReturnRatesReport.map((item) => ({
    productId: item.productId,
    returnRate: item.returnRate,
    totalSold: item.totalSold,
    productName: item.productName,
    returnedQuantity: item.returnedQuantity,
  }));

  return (
    <ResponsiveContainer width="100%" height={600} className="px-2 py-4">
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="totalSold"
          name="Total Sold"
          tick={{ fontSize: 12 }}
          label={{
            value: "Total Sold",
            position: "insideBottom",
            fontSize: 14,
            offset: -5,
          }}
        />
        <YAxis
          type="number"
          dataKey="returnRate"
          name="Return Rate"
          tick={{ fontSize: 12 }}
          label={{
            value: "Return Rate",
            angle: -90,
            position: "insideLeft",
            fontSize: 14,
            offset: -20,
          }}
          domain={["auto", "auto"]}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload;
              return (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <p>
                    <strong>Product Name: {data.productName}</strong>
                  </p>
                  <p>Return Rate: {(data.returnRate * 100).toFixed(2)}%</p>
                  <p>Total Sold: {data.totalSold}</p>
                  <p>Returned Quantity: {data.returnedQuantity}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Scatter name="Return Rates" data={chartData} fill="#82ca9d" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
