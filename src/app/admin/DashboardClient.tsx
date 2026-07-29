"use client";

import dynamic from "next/dynamic";
import { memo, useMemo } from "react";

const BarChart = dynamic(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
);
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
);
const Line = dynamic(() => import("recharts").then((m) => m.Line), {
  ssr: false,
});

interface DashboardProps {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  ordersByMonth: Record<string, number>;
  revenueByMonth: Record<string, number>;
  recentOrders: any[];
  lowStockProducts: any[];
}

const tooltipStyle = {
  background: "#1a1a1a",
  border: "1px solid rgba(212,175,55,0.2)",
  borderRadius: "12px",
  color: "#f5f0e8",
};

function AdminDashboard(props: DashboardProps) {
  const ordersChartData = useMemo(
    () =>
      Object.entries(props.ordersByMonth).map(([month, count]) => ({
        month,
        orders: count,
      })),
    [props.ordersByMonth]
  );

  const revenueChartData = useMemo(
    () =>
      Object.entries(props.revenueByMonth).map(([month, rev]) => ({
        month,
        revenue: rev,
      })),
    [props.revenueByMonth]
  );

  const statCards = useMemo(
    () => [
      {
        label: "إجمالي المنتجات",
        value: props.totalProducts,
        icon: "🧴",
        color: "from-blue-500/20 to-blue-500/5",
      },
      {
        label: "إجمالي الطلبات",
        value: props.totalOrders,
        icon: "📦",
        color: "from-green-500/20 to-green-500/5",
      },
      {
        label: "العملاء",
        value: props.totalCustomers,
        icon: "👥",
        color: "from-purple-500/20 to-purple-500/5",
      },
      {
        label: "الإيرادات",
        value: `${props.revenue.toLocaleString("ar-SA")} جنيه`,
        icon: "💰",
        color: "from-gold/20 to-gold/5",
      },
    ],
    [props.totalProducts, props.totalOrders, props.totalCustomers, props.revenue]
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl p-6 bg-gradient-to-br ${card.color} border border-white/5`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-cream/50 text-sm">{card.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="glassmorphism rounded-2xl p-6 border border-white/5 col-span-2">
          <h3 className="text-white font-semibold mb-4">حالات الطلبات</h3>
          <div className="flex gap-4">
            {[
              {
                label: "قيد الانتظار",
                value: props.pendingOrders,
                color: "bg-yellow-500",
              },
              {
                label: "قيد المعالجة",
                value: props.processingOrders,
                color: "bg-blue-500",
              },
              {
                label: "تم التوصيل",
                value: props.deliveredOrders,
                color: "bg-green-500",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 glassmorphism rounded-xl p-4 text-center border border-white/5"
              >
                <div
                  className={`w-3 h-3 rounded-full ${item.color} mx-auto mb-2`}
                />
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="text-cream/40 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphism rounded-2xl p-6 border border-white/5">
          <h3 className="text-white font-semibold mb-4">
            منتجات منخفضة المخزون
          </h3>
          {props.lowStockProducts.length === 0 ? (
            <p className="text-cream/40 text-sm">
              لا توجد منتجات منخفضة المخزون
            </p>
          ) : (
            <div className="space-y-3">
              {props.lowStockProducts.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center">
                  <span className="text-cream/70 text-sm">{p.nameAr}</span>
                  <span className="text-red-400 text-xs font-bold">
                    {p.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="glassmorphism rounded-2xl p-6 border border-white/5">
          <h3 className="text-white font-semibold mb-4">الطلبات الشهرية</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="orders"
                fill="#d4af37"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glassmorphism rounded-2xl p-6 border border-white/5">
          <h3 className="text-white font-semibold mb-4">الإيرادات الشهرية</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#d4af37"
                strokeWidth={2}
                dot={{ fill: "#d4af37", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glassmorphism rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-semibold mb-4">آخر الطلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-cream/40 text-sm border-b border-white/5">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">الحالة</th>
                <th className="pb-3 font-medium">المجموع</th>
                <th className="pb-3 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {props.recentOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 text-sm"
                >
                  <td className="py-3 text-cream/70 font-mono text-xs">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : order.status === "processing"
                          ? "bg-blue-500/10 text-blue-400"
                          : order.status === "delivered"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {order.status === "pending"
                        ? "قيد الانتظار"
                        : order.status === "processing"
                        ? "قيد المعالجة"
                        : order.status === "delivered"
                        ? "تم التوصيل"
                        : "ملغي"}
                    </span>
                  </td>
                  <td className="py-3 text-gold font-semibold">
                    {order.total.toLocaleString("ar-SA")} جنيه
                  </td>
                  <td className="py-3 text-cream/40">
                    {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default memo(AdminDashboard);
