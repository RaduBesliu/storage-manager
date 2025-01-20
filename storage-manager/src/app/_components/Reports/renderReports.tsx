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
  RadialBarChart,
  RadialBar,
  Treemap,
  ComposedChart,
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

export const renderRadialBarChart = (
  data: { productName: string; quantitySold: number }[],
) => {
  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#ff8042",
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="10%"
        outerRadius="80%"
        barSize={50}
        data={data.map((item) => ({
          name: item.productName,
          uv: item.quantitySold,
        }))}
      >
        <RadialBar
          dataKey="uv"
          background={{ fill: "#eee" }}
          label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </RadialBar>
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={{
            top: "50%",
            right: 20,
            transform: "translate(0, -50%)",
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export const renderTreemap = (data: { name: string; size: number }[]) => {
  const CustomizedContent: React.FC = (props: any) => {
    const { x, y, width, height, name, size } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: "#8884d8",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
        {width > 40 && height > 20 && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 5}
              textAnchor="middle"
              fill="#fff"
              fontSize={14}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 15}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
            >
              {size ? `${size.toFixed(2)} RON` : "N/A"}
            </text>
          </>
        )}
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={data}
        dataKey="size"
        nameKey="name"
        stroke="#fff"
        fill="#8884d8"
        content={<CustomizedContent />}
      />
    </ResponsiveContainer>
  );
};

export const renderPieChart = (
  innerData: any[] | undefined,
  outerData: any[] | undefined,
) => {
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#d0ed57",
    "#8dd1e1",
    "#a4de6c",
    "#ff8042",
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Legend
          payload={
            innerData?.map((entry, index) => ({
              value: entry.name,
              type: "square",
              color: COLORS[index % COLORS.length],
            })) ?? []
          }
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{
            top: "50%",
            right: 20,
            transform: "translate(0, -50%)",
          }}
        />

        {innerData && innerData.length > 0 && (
          <Pie
            data={innerData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#8884d8"
          >
            {innerData.map((entry, index) => (
              <Cell
                key={`cell-inner-${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        )}

        {outerData && outerData.length > 0 && (
          <Pie
            data={outerData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#82ca9d"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {outerData.map((entry, index) => (
              <Cell
                key={`cell-outer-${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

const aggregateData = (data: any[]) => {
  const aggregatedMap = data.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = { ...item };
    } else {
      acc[item.name].totalRevenue += item.totalRevenue;
      acc[item.name].quantitySold += item.quantitySold;
      acc[item.name].returns += item.returns;
      acc[item.name].priceChange += item.priceChange;
    }
    return acc;
  }, {});

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(aggregatedMap);
};

export const renderComposedChart = (
  data: {
    name: string | undefined;
    totalRevenue: number;
    quantitySold: number;
    returns: number;
    priceChange: number;
  }[],
) => {
  const sortedData = data.sort((a, b) => {
    if (!a.name || !b.name) {
      return 0;
    }

    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    return dateA.getTime() - dateB.getTime();
  });

  const aggregatedData = aggregateData(sortedData);

  return (
    <ResponsiveContainer width="100%" height={600}>
      <ComposedChart
        data={aggregatedData}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey="name"
          scale="band"
          tick={{ fontSize: 12 }}
          label={{
            value: "Date",
            position: "insideBottom",
            offset: -5,
          }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend
          wrapperStyle={{
            padding: "20px", // Adds padding around the legend
          }}
        />
        <Area
          type="monotone"
          dataKey="totalRevenue"
          fill="#8884d8"
          stroke="#8884d8"
          name="Total Revenue"
        />
        <Bar
          dataKey="quantitySold"
          barSize={20}
          fill="#413ea0"
          name="Quantity Sold"
        />
        <Line
          type="monotone"
          dataKey="priceChange"
          stroke="#ff7300"
          name="Price Change"
        />
        <Scatter dataKey="returns" fill="red" name="Returns" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
