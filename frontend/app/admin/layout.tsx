import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
}
