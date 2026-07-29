import { prisma } from "@/lib/prisma";
import AdminDashboard from "./DashboardClient";

export default async function AdminPage() {
  const [totalProducts, totalOrders, totalCustomers, orders, products] =
    await Promise.all([
      prisma.product.count({ where: { hidden: false } }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.findMany({
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
          items: { select: { price: true, quantity: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.product.findMany({
        where: { hidden: false },
        select: {
          id: true,
          nameAr: true,
          stock: true,
          price: true,
          category: { select: { nameAr: true } },
        },
        take: 100,
      }),
    ]);

  const revenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const processingOrders = orders.filter((o) => o.status === "processing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const ordersByMonth: Record<string, number> = {};
  const revenueByMonth: Record<string, number> = {};
  orders.forEach((o) => {
    const month = new Date(o.createdAt).toLocaleString("ar-SA", {
      month: "short",
      year: "2-digit",
    });
    ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
    if (o.status === "delivered") {
      revenueByMonth[month] = (revenueByMonth[month] || 0) + o.total;
    }
  });

  return (
    <AdminDashboard
      totalProducts={totalProducts}
      totalOrders={totalOrders}
      totalCustomers={totalCustomers}
      revenue={revenue}
      pendingOrders={pendingOrders}
      processingOrders={processingOrders}
      deliveredOrders={deliveredOrders}
      ordersByMonth={ordersByMonth}
      revenueByMonth={revenueByMonth}
      recentOrders={orders.slice(0, 5)}
      lowStockProducts={products.filter((p) => p.stock < 10)}
    />
  );
}
