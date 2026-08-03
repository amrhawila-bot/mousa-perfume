"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createToken,
  getAdminSession,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function adminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };

  const valid = await verifyPassword(password, admin.password);
  if (!valid) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };

  const token = await createToken({ id: admin.id, email: admin.email });
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  revalidatePath("/admin/login");
}

export async function adminUpdateAccount(input: {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const session = await getAdminSession();
  if (!session) return { error: "غير مصرح، سجل الدخول أولاً" };

  if (input.newPassword !== input.confirmPassword) {
    return { error: "كلمة المرور الجديدة وتأكيدها غير متطابقتين" };
  }
  if (input.newPassword.length < 8) {
    return { error: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف" };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.id } });
  if (!admin) return { error: "المدير غير موجود" };

  const valid = await verifyPassword(input.currentPassword, admin.password);
  if (!valid) return { error: "كلمة المرور الحالية غير صحيحة" };

  const hashed = await hashPassword(input.newPassword);

  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function customerRegister(
  name: string,
  email: string,
  password: string
) {
  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) return { error: "البريد الإلكتروني مستخدم بالفعل" };

  const hashed = await hashPassword(password);
  const customer = await prisma.customer.create({
    data: { name, email, password: hashed },
  });

  const token = await createToken({ id: customer.id, email: customer.email });
  const cookieStore = await cookies();
  cookieStore.set("customer_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  revalidatePath("/account");
  return { success: true };
}

export async function customerLogin(email: string, password: string) {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };

  const valid = await verifyPassword(password, customer.password);
  if (!valid) return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };

  const token = await createToken({
    id: customer.id,
    email: customer.email,
  });
  const cookieStore = await cookies();
  cookieStore.set("customer_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  revalidatePath("/account");
  return { success: true };
}

export async function customerLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("customer_token");
  revalidatePath("/");
}
