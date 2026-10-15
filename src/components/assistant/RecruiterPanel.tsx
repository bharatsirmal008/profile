"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { AttachmentCard } from "./AttachmentCard";
import { ACCEPTED_FILES, saveAttachment, deleteAttachment, type ChatAttachment } from "../../lib/attachment-store";

export type RecruiterStatus = { session: string; revision: string | null; busy: boolean; preserveRevision?: boolean };
export function RecruiterPanel({ api, session, disabled, onStatus, onBegin, children, pending, onAttachment }: {
  children: ReactNode; api: string; session: string; disabled: boolean;
  onStatus: (status: RecruiterStatus) => void; onBegin: () => void;
  pending: ChatAttachment | null; onAttachment: (file: ChatAttachment | null) => void;
}) {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const callbacks = useRef({ onStatus, onBegin, onAttachment });
  const revision = useRef<string | null>(null);
  const mounted = useRef(true);
  const selecting = useRef(false);
  useEffect(() => { callbacks.current = { onStatus, onBegin, onAttachment }; });
  useEffect(() => {
    mounted.current = true;
    if (!session) return;
    const abort = new AbortController();
    callbacks.current.onStatus({ session, revision: null, busy: true });
    fetch(`${api}/recruiter/context?session_id=${encodeURIComponent(session)}`, { signal: abort.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Attachment context is unavailable. You can still use normal chat.");
        return response.json();
      }).then(data => { if (!abort.signal.aborted) revision.current = data.context?.revision ?? null; })
      .catch(error => { if (!abort.signal.aborted) setNotice(error.message); })
      .finally(() => { if (!abort.signal.aborted) callbacks.current.onStatus({ session, revision: revision.current, busy: false }); });
    return () => { mounted.current = false; abort.abort(); };
  }, [api, session]);

  async function select(file: File) {
    if (disabled || selecting.current) return;
    callbacks.current.onBegin();
    selecting.current = true;
    setBusy(true);
    setNotice("");
    callbacks.current.onStatus({ session, revision: revision.current, busy: true, preserveRevision: true });
    try {
      const attachment = await saveAttachment(file);
      if (!mounted.current) { await deleteAttachment(attachment.id); return; }
      if (pending) await deleteAttachment(pending.id);
      callbacks.current.onAttachment(attachment);
    } catch (error) { if (mounted.current) setNotice(error instanceof Error ? error.message : "Could not select this file."); }
    finally {
      selecting.current = false;
      if (mounted.current) {
        setBusy(false);
        callbacks.current.onStatus({ session, revision: revision.current, busy: false, preserveRevision: true });
      }
      if (input.current) input.current.value = "";
    }
  }
  function remove() {
    if (!pending || disabled || busy) return;
    void deleteAttachment(pending.id).catch(() => {});
    callbacks.current.onAttachment(null);
  }
  return <div className="pointer-events-auto relative mx-auto w-full max-w-[620px] text-sm text-emerald-50" aria-label="Chat composer">
    <input ref={input} type="file" accept={ACCEPTED_FILES} className="hidden" aria-label="Upload file or image" onChange={event => { const file = event.target.files?.[0]; if (file) void select(file); }} />
    <div className="rounded-[26px] border border-emerald-300/50 bg-[#071a14]/95 shadow-[0_0_20px_#10b98122] backdrop-blur-xl">
      {pending && <div className="px-3 pt-3"><AttachmentCard attachment={pending} onRemove={remove} disabled={disabled || busy}/></div>}
      <div className="flex items-end gap-1 px-2 py-1">
        <button type="button" disabled={disabled || busy || !session} onClick={() => input.current?.click()} aria-label="Upload file or image" title="Upload PDF, Word, text or image" className="mb-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-emerald-200 hover:bg-emerald-900/40 disabled:opacity-50"><Plus size={20}/></button>
        {children}
      </div>
      {busy && <p role="status" className="px-4 pb-2 text-xs text-emerald-100/70">Preparing attachment…</p>}
    </div>
    {notice && <p role="status" className="mt-2 flex items-center justify-between gap-2 text-xs text-amber-100">{notice}<button type="button" aria-label="Dismiss attachment notice" onClick={() => setNotice("")}><X size={14}/></button></p>}
  </div>;
}
