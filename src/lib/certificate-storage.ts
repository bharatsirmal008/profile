export type CertificateCategory = "Internship" | "Course" | "Other";

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  description: string;
  category: CertificateCategory;
  skills: string[];
  file?: Blob;
  filename?: string;
  filePath?: string;
  fileType?: string;
  isPrivate?: boolean;
  isDeleted?: boolean;
};

export const builtInCertificates: Certificate[] = [
  { id: "google-analytics", category: "Course", title: "Google Cloud Data Analytics Certificate", issuer: "Google Cloud", description: "Hands-on experience with cloud-based data pipelines, data analysis, and structured reporting tools.", skills: ["Data Analytics", "Data Pipelines", "Reporting"] },
  { id: "google-foundations", category: "Course", title: "Google Cloud Career Launchpad — Foundations Track", issuer: "Google Cloud", description: "Training in cloud computing fundamentals, data management, and analytics best practices.", skills: ["Cloud Computing", "Data Management", "Analytics"] },
];

export function mergeCertificates(saved: Certificate[], includePrivate = false): Certificate[] {
  const overrides = new Map(saved.map(certificate => [certificate.id, certificate]));
  const builtInIds = new Set(builtInCertificates.map(certificate => certificate.id));
  const merged = [...saved.filter(certificate => !builtInIds.has(certificate.id)), ...builtInCertificates.map(certificate => overrides.get(certificate.id) || certificate)].filter(certificate => certificate.isDeleted !== true);
  return includePrivate ? merged : merged.filter(certificate => certificate.isPrivate !== true);
}

export const CERTIFICATES_CHANGED = "portfolio-certificates-changed";

function notifyCertificatesChanged() {
  window.dispatchEvent(new Event(CERTIFICATES_CHANGED));
  try { localStorage.setItem(CERTIFICATES_CHANGED, crypto.randomUUID()); } catch { /* IndexedDB remains the source of truth. */ }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("portfolio-certificates", 1);
    request.onupgradeneeded = () => { request.result.createObjectStore("certificates", { keyPath: "id" }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Certificate storage is busy. Close other portfolio tabs and retry."));
  });
}

export async function loadCertificates(): Promise<Certificate[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("certificates", "readonly");
    const request = transaction.objectStore("certificates").getAll();
    transaction.oncomplete = () => { db.close(); resolve(request.result as Certificate[]); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
    transaction.onabort = () => { db.close(); reject(transaction.error); };
  });
}

export async function saveCertificate(certificate: Certificate): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("certificates", "readwrite");
    transaction.objectStore("certificates").put(certificate);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
    transaction.onabort = () => { db.close(); reject(transaction.error); };
  });
  notifyCertificatesChanged();
}

export async function deleteCertificate(id: string): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction("certificates", "readwrite");
    const store = transaction.objectStore("certificates");
    const builtIn = builtInCertificates.find(certificate => certificate.id === id);
    if (builtIn) store.put({ ...builtIn, isDeleted: true });
    else store.delete(id);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
    transaction.onabort = () => { db.close(); reject(transaction.error); };
  });
  notifyCertificatesChanged();
}
