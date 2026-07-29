"use client";

import { useState, useEffect, useCallback } from "react";
import { updateOrderStatus } from "@/app/actions/orders";
import toast from "react-hot-toast";

interface Order {
  id: string;
  customer: { name: string; email: string };
  items: {
    id: string;
    product: { nameAr: string };
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
  address: string;
  phone: string;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  processing: "قيد المعالجة",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/orders", { signal: controller.signal })
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const handleStatus = useCallback(
    async (id: string, status: string) => {
      const result = await updateOrderStatus(id, status);
      if (result.success) {
        toast.success("تم تحديث الحالة");
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
      }
    },
    []
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">الطلبات</h1>

      <div className="glassmorphism rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-cream/40 text-sm border-b border-white/5">
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">العميل</th>
                <th className="p-4 font-medium">المنتجات</th>
                <th className="p-4 font-medium">المجموع</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 text-cream/50 text-sm font-mono">
                    #{order.id.slice(0, 6)}
                  </td>
                  <td className="p-4">
                    <p className="text-white text-sm">{order.customer.name}</p>
                    <p className="text-cream/30 text-xs">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <p key={item.id} className="text-cream/60 text-xs">
                          {item.product.nameAr} x{item.quantity}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gold text-sm font-semibold">
                    {order.total.toLocaleString("ar-SA")} جنيه
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatus(order.id, e.target.value)
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        statusStyles[order.status] || ""
                      }`}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="delivered">تم التوصيل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </td>
                  <td className="p-4 text-cream/40 text-xs">
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
