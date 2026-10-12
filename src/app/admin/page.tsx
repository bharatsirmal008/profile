import type { Metadata } from "next";
import { AdminGate } from "@/components/AdminGate";
import { AdminDashboard } from "@/components/AdminDashboard";

export const metadata: Metadata = { title: "Portfolio Admin | Bharat Sirmal", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminGate><AdminDashboard /></AdminGate>; }
