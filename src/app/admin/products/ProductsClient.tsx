"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  deleteProduct,
  createProduct,
  updateProduct,
} from "@/app/actions/products";
import toast from "react-hot-toast";

interface Props {
  products: any[];
  categories: any[];
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

function productImageList(product: any): string[] {
  const fromImages = (product.images || []).map((img: any) => img.url);
  if (fromImages.length) return fromImages;
  return product.image ? [product.image] : [];
}

export default function ProductsClient({ products, categories }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const filtered = products.filter(
    (p) =>
      p.nameAr.includes(search) ||
      p.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const cleanupNewImages = async () => {
    const newOnes = images.filter((u) => !existingImages.includes(u));
    if (newOnes.length) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: newOnes }),
      });
    }
  };

  const closeForm = async () => {
    if (showForm) await cleanupNewImages();
    setShowForm(false);
    setEditing(null);
    setImages([]);
    setExistingImages([]);
    setRemovedImages([]);
    setFormKey((k) => k + 1);
  };

  const openCreate = () => {
    setEditing(null);
    setImages([]);
    setExistingImages([]);
    setRemovedImages([]);
    setShowForm(true);
    setFormKey((k) => k + 1);
  };

  const openEdit = (product: any) => {
    const list = productImageList(product);
    setEditing(product);
    setImages(list);
    setExistingImages(list);
    setRemovedImages([]);
    setShowForm(true);
    setFormKey((k) => k + 1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("تم الحذف بنجاح");
        router.refresh();
      }
    }
  };

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`نوع الملف غير مدعوم: ${file.name}. الأنواع المسموحة: jpg, jpeg, png, webp`);
        e.target.value = "";
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`حجم الملف كبير جداً: ${file.name}. الحد الأقصى 5MB`);
        e.target.value = "";
        return;
      }
    }

    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل رفع الصور");
        return;
      }
      setImages((prev) => [...prev, ...data.urls]);
      toast.success(`تم رفع ${data.urls.length} صورة`);
    } catch {
      toast.error("فشل رفع الصور");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (url: string) => {
    if (existingImages.includes(url)) {
      setRemovedImages((prev) => [...prev, url]);
    } else {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [url] }),
      }).catch(() => {});
    }
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const handleSetPrimary = (url: string) => {
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("images", JSON.stringify(images));
    formData.set("removedImages", JSON.stringify(removedImages));
    const result = editing
      ? await updateProduct(editing.id, formData)
      : await createProduct(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editing ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
      setShowForm(false);
      setEditing(null);
      setImages([]);
      setExistingImages([]);
      setRemovedImages([]);
      form.reset();
      setFormKey((k) => k + 1);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">المنتجات</h1>
        <button
          onClick={() => {
            if (showForm) {
              closeForm();
            } else {
              openCreate();
            }
          }}
          className="px-6 py-2.5 bg-gold text-black rounded-xl text-sm font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
        >
          {showForm ? "إلغاء" : "إضافة منتج"}
        </button>
      </div>

      <input
        type="text"
        placeholder="بحث عن منتج..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/50 transition-colors mb-6"
      />

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <form
              key={formKey}
              onSubmit={handleSubmit}
              className="glassmorphism rounded-2xl p-6 border border-white/5 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cream/60 text-sm mb-1">الاسم بالعربية</label>
                  <input
                    name="nameAr"
                    defaultValue={editing?.nameAr}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">الاسم بالإنجليزية</label>
                  <input
                    name="nameEn"
                    defaultValue={editing?.nameEn}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-cream/60 text-sm mb-1">الوصف</label>
                  <textarea
                    name="description"
                    defaultValue={editing?.description}
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-cream/60 text-sm mb-2">صور المنتج</label>
                  {images.length === 0 && (
                    <p className="text-cream/30 text-xs mb-3">
                      لا توجد صور بعد. ارفع صورة أو أكثر لعرضها على المتجر.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 mb-3">
                    {images.map((url, idx) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt={`صورة المنتج ${idx + 1}`}
                          className={`w-20 h-20 rounded-xl object-cover border-2 bg-white/5 ${
                            idx === 0 ? "border-gold" : "border-white/10"
                          }`}
                        />
                        {idx === 0 && (
                          <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            رئيسية
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(url)}
                          title="تعيين كصورة رئيسية"
                          className="absolute bottom-0 right-0 p-1.5 bg-black/70 rounded-tl-xl text-gold text-xs hover:bg-black"
                        >
                          ★
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          title="حذف الصورة"
                          className="absolute top-0 left-0 p-1.5 bg-red-500/80 rounded-br-xl text-white text-xs hover:bg-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleFilesChange}
                      disabled={uploading}
                      className="block w-full text-sm text-cream/60 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-gold/20 file:text-gold file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-gold/30"
                    />
                    {uploading && (
                      <span className="text-gold text-xs animate-pulse whitespace-nowrap">
                        جاري الرفع...
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">العلامة التجارية</label>
                  <input
                    name="brand"
                    defaultValue={editing?.brand || "MOUSA"}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">التصنيف</label>
                  <select
                    name="categoryId"
                    defaultValue={editing?.categoryId}
                    required
                    className="w-full px-4 py-2.5 bg-charcoal border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">السعر</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={editing?.price}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">السعر القديم</label>
                  <input
                    name="oldPrice"
                    type="number"
                    step="0.01"
                    defaultValue={editing?.oldPrice || ""}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">المخزون</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={editing?.stock || 0}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">الجنس</label>
                  <select
                    name="gender"
                    defaultValue={editing?.gender || "يونيسكس"}
                    className="w-full px-4 py-2.5 bg-charcoal border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  >
                    <option value="رجالي">رجالي</option>
                    <option value="حريمي">حريمي</option>
                    <option value="يونيسكس">يونيسكس</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">التركيز</label>
                  <select
                    name="concentration"
                    defaultValue={editing?.concentration || "Eau de Parfum"}
                    className="w-full px-4 py-2.5 bg-charcoal border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  >
                    <option value="Eau de Parfum">Eau de Parfum</option>
                    <option value="Eau de Toilette">Eau de Toilette</option>
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cream/60 text-sm mb-1">الحجم</label>
                  <input
                    name="size"
                    defaultValue={editing?.size || "100ml"}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-cream/60 text-sm">مميز</label>
                  <input
                    name="featured"
                    type="checkbox"
                    defaultChecked={editing?.featured}
                    className="w-4 h-4 accent-gold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-8 py-2.5 bg-gold text-black rounded-xl text-sm font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300"
              >
                {editing ? "تحديث المنتج" : "إضافة المنتج"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glassmorphism rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-cream/40 text-sm border-b border-white/5">
                <th className="p-4 font-medium">المنتج</th>
                <th className="p-4 font-medium">التصنيف</th>
                <th className="p-4 font-medium">السعر</th>
                <th className="p-4 font-medium">المخزون</th>
                <th className="p-4 font-medium">مميز</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.images?.length
                            ? product.images[0].url
                            : product.image || "/placeholder.svg"
                        }
                        alt={product.nameAr}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 bg-white/5"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{product.nameAr}</p>
                        <p className="text-cream/30 text-xs">{product.nameEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-cream/50 text-sm">{product.category.nameAr}</td>
                  <td className="p-4 text-gold text-sm font-semibold">
                    {product.price.toLocaleString("ar-SA")} جنيه
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.stock < 10
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.featured ? (
                      <span className="text-gold">★</span>
                    ) : (
                      <span className="text-cream/20">☆</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="px-3 py-1.5 text-xs bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        حذف
                      </button>
                    </div>
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
