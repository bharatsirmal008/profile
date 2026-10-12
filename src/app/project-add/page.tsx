import { AdminGate } from "@/components/AdminGate";
import type { Metadata } from "next";
import { ProjectAddForm } from "@/components/ProjectAddForm";

export const metadata: Metadata = {
  title: "Add Project | Bharat Sirmal",
  robots: { index: false, follow: false },
};

export default function ProjectAddPage() {
  return <AdminGate><ProjectAddForm /></AdminGate>;
}
