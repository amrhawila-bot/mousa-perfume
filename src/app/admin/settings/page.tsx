import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function AdminSettings() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({
    where: { id: session.id },
    select: { name: true, email: true },
  });
  if (!admin) redirect("/admin/login");

  return <SettingsClient name={admin.name} email={admin.email} />;
}
