"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Award, Check, Database, FileText, Folder, LoaderCircle, MoreHorizontal, Search, Upload } from "lucide-react";
import { importBrowserContent } from "@/lib/import-browser-content";
import styles from "./AdminDashboard.module.css";

export function AdminDashboard() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const runImport = async () => {
    setBusy(true); setError("");
    try { const count = await importBrowserContent(setStatus); setStatus(`Import complete: ${count} entries added. Existing cloud entries were kept.`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Import failed. Your browser data is unchanged. You can retry safely."); }
    finally { setBusy(false); }
  };
  return (
    <main className={styles.desktop}>
      <div className={styles.window}>
        <div className={styles.titlebar} aria-hidden="true">
          <div className={styles.trafficLights}><span /><span /><span /></div>
          <div className={styles.toolbarIcons}><Search size={16} /><MoreHorizontal size={19} /></div>
        </div>
        <svg className={styles.ambientWaves} viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id="adminBlueWave" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#dcecff" stopOpacity=".85" /><stop offset="1" stopColor="#e9efff" stopOpacity=".1" /></linearGradient><linearGradient id="adminLilacWave" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#e6e0f6" stopOpacity=".7" /><stop offset="1" stopColor="#e5f2ff" stopOpacity=".3" /></linearGradient></defs>
          <path d="M0 135 C180 190 190 460 460 490 S890 220 1200 180 V700 H0Z" fill="url(#adminBlueWave)" />
          <path d="M0 465 C240 540 300 760 640 645 S1010 380 1200 410 V700 H0Z" fill="url(#adminLilacWave)" />
        </svg>
        <div className={styles.content}>
          <Link href="/" className={styles.back}><ArrowLeft size={17} />Portfolio</Link>
          <h1>Portfolio admin</h1>
          <nav className={styles.navigation} aria-label="Management pages">
            {[{ url: "/project-add", label: "Manage projects", icon: Folder }, { url: "/upload-certificates", label: "Manage certificates", icon: Award }, { url: "/resume-update", label: "Edit resume", icon: FileText }].map(({ url, label, icon: Icon }, index) => <Link key={url} href={url} className={index === 0 ? styles.primaryLink : undefined}><Icon size={20} strokeWidth={1.6} />{label}</Link>)}
          </nav>
          <section className={styles.importCard} aria-labelledby="import-content-heading">
            <div className={styles.databaseIcon}><Database size={28} strokeWidth={1.5} /></div>
            <div className={styles.cardContent}>
              <h2 id="import-content-heading">Import existing content</h2>
              <p>Import the bundled portfolio content and projects, certificate files, and resume saved in this browser. Public entries will become visible to everyone; private entries stay private. Existing cloud entries are skipped, and your browser originals are kept.</p>
              <p>Run this on localhost in the same browser where you previously added content. Use the same Supabase project for localhost and your deployed portfolio.</p>
              <button type="button" disabled={busy} onClick={runImport} className={styles.importButton}>{busy ? <LoaderCircle size={18} className="animate-spin motion-reduce:animate-none" /> : <Upload size={18} />}<span>{busy ? "Importing…" : "Import browser and bundled content"}</span></button>
              {status && <div role="status" className={styles.success}>{busy ? <LoaderCircle size={19} className="animate-spin motion-reduce:animate-none" /> : <span className={styles.checkIcon}><Check size={14} /></span>}<span>{status}</span></div>}
              {error && <p role="alert" className={styles.error}>{error} Local data has been kept. Retry to continue; completed entries will be skipped.</p>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
