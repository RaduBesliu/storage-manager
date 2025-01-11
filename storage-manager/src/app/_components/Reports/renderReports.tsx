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
} from "recharts";
import { format } from "date-fns";
import type {
  AdjustmentReport,
  PriceChangeReport,
  RestockReport,
  ReturnReport,
  SaleReport,
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
        <Legend />
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
        <Legend />
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
        <Legend />
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
        <Legend />
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
        <Legend />
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
