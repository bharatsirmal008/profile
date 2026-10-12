import { AdminGate } from "@/components/AdminGate";
import type { Metadata } from "next";
import { CertificateUploadForm } from "@/components/CertificateUploadForm";

export const metadata: Metadata = {
  title: "Manage Certificates | Bharat Sirmal",
  robots: { index: false, follow: false },
};

export default function UploadCertificatesPage() {
  return <AdminGate><CertificateUploadForm /></AdminGate>;
}
