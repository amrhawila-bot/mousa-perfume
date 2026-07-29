"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  _count?: { products: number };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);

  const loadCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editing ? { id: editing.id, nameAr, nameEn } : { nameAr, nameEn }
      ),
    });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(editing ? "تم التحديث" : "تمت الإضافة");
      setShowForm(false);
      setEditing(null);
      setNameAr("");
      setNameEn("");
      loadCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("تم الحذف");
      loadCategories();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">التصنيفات</h1>
        <button
          onClick={() => {
            setEditing(null);
            setNameAr("");
            setNameEn("");
            setShowForm(!showForm);
          }}
          className="px-6 py-2.5 bg-gold text-black rounded-xl text-sm font-semibold transition-all duration-300"
        >
          {showForm ? "إلغاء" : "إضافة تصنيف"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glassmorphism rounded-2xl p-6 border border-white/5 space-y-4 mb-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cream/60 text-sm mb-1">الاسم بالعربية</label>
                <input
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-cream/60 text-sm mb-1">الاسم بالإنجليزية</label>
                <input
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-8 py-2.5 bg-gold text-black rounded-xl text-sm font-semibold"
            >
              {editing ? "تحديث" : "إضافة"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glassmorphism rounded-2xl p-6 border border-white/5 flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-semibold">{cat.nameAr}</h3>
              <p className="text-cream/30 text-xs">{cat.nameEn}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(cat);
                  setNameAr(cat.nameAr);
                  setNameEn(cat.nameEn);
                  setShowForm(true);
                }}
                className="px-3 py-1.5 text-xs bg-blue-500/10 text-blue-400 rounded-lg"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
