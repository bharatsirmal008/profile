import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Portfolio Admin | Bharat Sirmal", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminGate><AdminDashboard /></AdminGate>; }
