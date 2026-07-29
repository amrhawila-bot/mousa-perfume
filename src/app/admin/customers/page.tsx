"use client";

import { useState, useEffect } from "react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then(setCustomers);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">العملاء</h1>

      <div className="glassmorphism rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-cream/40 text-sm border-b border-white/5">
                <th className="p-4 font-medium">الاسم</th>
                <th className="p-4 font-medium">البريد الإلكتروني</th>
                <th className="p-4 font-medium">الهاتف</th>
                <th className="p-4 font-medium">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-white text-sm">{customer.name}</td>
                  <td className="p-4 text-cream/50 text-sm">{customer.email}</td>
                  <td className="p-4 text-cream/50 text-sm">{customer.phone || "—"}</td>
                  <td className="p-4 text-cream/40 text-xs">
                    {new Date(customer.createdAt).toLocaleDateString("ar-SA")}
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
