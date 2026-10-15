import { AdminGate } from "@/components/admin/AdminGate";
import type { Metadata } from "next";
import { ProjectAddForm } from "@/components/admin/ProjectAddForm";

export const metadata: Metadata = {
  title: "Add Project | Bharat Sirmal",
  robots: { index: false, follow: false },
};

export default function ProjectAddPage() {
  return <AdminGate><ProjectAddForm /></AdminGate>;
}
