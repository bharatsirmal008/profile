"use client";

import { useEffect, useState } from "react";
import { CERTIFICATES_CHANGED, loadCertificates, mergeCertificates, type Certificate } from "./certificate-storage";
import { cloudEnabled } from "./supabase";
import { useCloudRecords } from "./cloud-content";

export type DisplayCertificate = Certificate & { fileUrl?: string };

export function useCertificates(includePrivate = false) {
  const cloud = useCloudRecords("certificate", includePrivate);
  const [certificates, setCertificates] = useState<DisplayCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cloudEnabled) return;
    let cancelled = false;
    let version = 0;
    let urls: string[] = [];
    const refresh = async () => {
      const current = ++version;
      try {
        const saved = await loadCertificates();
        if (cancelled || current !== version) return;
        const nextUrls: string[] = [];
        const next = mergeCertificates(saved, includePrivate).map(certificate => {
          const fileUrl = certificate.file ? URL.createObjectURL(certificate.file) : undefined;
          if (fileUrl) nextUrls.push(fileUrl);
          return { ...certificate, fileUrl };
        });
        urls.forEach(url => URL.revokeObjectURL(url));
        urls = nextUrls;
        setCertificates(next);
        setError("");
      } catch {
        if (!cancelled && current === version) setError("Saved certificates could not be loaded. Browser storage may be unavailable.");
      } finally {
        if (!cancelled && current === version) setLoading(false);
      }
    };
    const onStorage = (event: StorageEvent) => { if (event.key === CERTIFICATES_CHANGED || event.key === null) void refresh(); };
    void refresh();
    window.addEventListener(CERTIFICATES_CHANGED, refresh);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    return () => {
      cancelled = true;
      urls.forEach(url => URL.revokeObjectURL(url));
      window.removeEventListener(CERTIFICATES_CHANGED, refresh);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
    };
  }, [includePrivate]);

  if (cloudEnabled) return { certificates: cloud.records.map(record => ({ ...record.data, id: record.id, isPrivate: record.is_private } as unknown as DisplayCertificate)), loading: cloud.loading, error: cloud.error };
  return { certificates, loading, error };
}
