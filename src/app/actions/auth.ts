"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createToken } from "@/lib/auth";
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
