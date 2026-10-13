"use client";

import { useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, FileUp, Mic, X } from "lucide-react";
import { languageLocale, type AssistantLanguage } from "../lib/voice-stream";

export type RecruiterStatus = { session: string; revision: string | null; busy: boolean };
type Context = { name: string; revision: string; expires_at: number };
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  start(): void; stop(): void; abort(): void;
  onresult: ((event: { resultIndex: number; results: { length: number; [key: number]: { isFinal: boolean; [key: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export function RecruiterPanel({ api, session, language, disabled, onStatus, onBegin }: {
  api: string; session: string; language: () => AssistantLanguage; disabled: boolean;
  onStatus: (status: RecruiterStatus) => void; onBegin: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<Context | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const callbacks = useRef({ onStatus, onBegin, language });
  const contextRef = useRef<Context | null>(null);
  const controller = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const working = useRef(false);
  useEffect(() => { callbacks.current = { onStatus, onBegin, language }; });

  useEffect(() => {
    mounted.current = true;
    if (!session) return;
    const abort = new AbortController();
    controller.current = abort;
    working.current = true;
    setBusy(true);
    callbacks.current.onStatus({ session, revision: null, busy: true });
    fetch(`${api}/recruiter/context?session_id=${encodeURIComponent(session)}`, { signal: abort.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Recruiter mode is unavailable. Check that the updated AI server is deployed.");
        return response.json();
      }).then(data => {
        if (abort.signal.aborted) return;
        contextRef.current = data.context;
        setContext(data.context);
      }).catch(error => { if (!abort.signal.aborted) setNotice(error.message); })
      .finally(() => {
        if (abort.signal.aborted) return;
        working.current = false;
        setBusy(false);
        callbacks.current.onStatus({ session, revision: contextRef.current?.revision ?? null, busy: false });
      });
    return () => {
      mounted.current = false;
      abort.abort();
      controller.current?.abort();
      recognition.current?.abort();
    };
  }, [api, session]);

  useEffect(() => {
    if (!context) return;
    const timer = setTimeout(() => {
      setNotice("The job description expired. Attach it again to continue the assessment.");
      // Retain the revision: the server must reject an expired assessment rather
      // than silently answering without the employer's requirements.
      callbacks.current.onStatus({ session, revision: context.revision, busy: working.current });
    }, Math.max(0, context.expires_at * 1000 - Date.now()));
    return () => clearTimeout(timer);
  }, [context, session]);

  async function save(file?: File, remove = false) {
    if (!session || disabled || working.current || listening) return;
    if (file && (file.size > 5 * 1024 * 1024 || !/\.(pdf|docx|txt)$/i.test(file.name))) {
      setNotice("Choose a PDF, DOCX or TXT file up to 5 MB. Convert older .doc files to .docx.");
      return;
    }
    callbacks.current.onBegin();
    working.current = true;
    setBusy(true);
    setNotice("");
    callbacks.current.onStatus({ session, revision: contextRef.current?.revision ?? null, busy: true });
    const abort = new AbortController();
    controller.current = abort;
    try {
      const query = `session_id=${encodeURIComponent(session)}`;
      const response = await fetch(file
        ? `${api}/recruiter/upload?${query}&filename=${encodeURIComponent(file.name)}`
        : `${api}/recruiter/context${remove ? `?${query}` : ""}`, {
        method: remove ? "DELETE" : "POST", signal: abort.signal,
        headers: { "Content-Type": file ? "application/octet-stream" : "application/json" },
        body: remove ? undefined : file ?? JSON.stringify({ session_id: session, text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Could not read these requirements. Check the text and try again.");
      if (abort.signal.aborted) return;
      contextRef.current = data.context;
      setContext(data.context);
      setText("");
      setNotice(remove ? "Job description removed. Earlier assessment messages remain visible; new answers use the current context." : "Requirements attached. Ask any hiring or role-specific question in the chat below.");
      if (!remove) setOpen(false);
    } catch (error) {
      if (!abort.signal.aborted) setNotice(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      if (mounted.current && !abort.signal.aborted) {
        working.current = false;
        setBusy(false);
        callbacks.current.onStatus({ session, revision: contextRef.current?.revision ?? null, busy: false });
      }
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function dictate() {
    if (listening) { recognition.current?.stop(); return; }
    const browser = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!Constructor) { setNotice("Dictation is unavailable in this browser. Paste requirements or use Chrome/Edge."); return; }
    callbacks.current.onBegin();
    const mic = new Constructor();
    recognition.current = mic;
    mic.lang = languageLocale(callbacks.current.language());
    mic.continuous = true;
    mic.interimResults = false;
    mic.onresult = event => {
      if (!mounted.current) return;
      const parts: string[] = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) parts.push(event.results[i][0].transcript);
      }
      if (parts.length) setText(previous => `${previous} ${parts.join(" ")}`.trim().slice(0, 24000));
    };
    mic.onerror = event => { if (mounted.current) setNotice(`Dictation stopped (${event.error}). You can still type the requirements.`); };
    mic.onend = () => {
      if (!mounted.current) return;
      setListening(false);
      callbacks.current.onStatus({ session, revision: contextRef.current?.revision ?? null, busy: working.current });
    };
    try {
      mic.start();
      setListening(true);
      setNotice("Listening to requirements. Stop dictation, review the text, then attach it.");
      callbacks.current.onStatus({ session, revision: contextRef.current?.revision ?? null, busy: true });
    } catch { setNotice("Could not start the microphone. Check microphone permission."); }
  }

  return <section className="pointer-events-auto mx-auto mb-2 w-full max-w-[620px] max-h-[50dvh] overflow-y-auto rounded-xl border border-emerald-300/20 bg-[#081c18] p-3 text-sm text-emerald-50" aria-label="Recruiter job description">
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" disabled={disabled || busy || !session || listening} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="recruiter-details"
        className="flex items-center gap-2 rounded-lg px-2 py-1 text-emerald-200 hover:bg-emerald-900/40 disabled:opacity-50">
        <BriefcaseBusiness size={16} /> {context ? "Replace job description" : "Recruiter · Add job description"}
      </button>
      {context && <><span className="min-w-0 flex-1 truncate" title={context.name}>Attached: {context.name}</span>
        <button type="button" disabled={disabled || busy || listening} onClick={() => save(undefined, true)} aria-label="Remove job description" className="rounded p-1 hover:bg-red-900/50"><X size={16} /></button></>}
      {busy && <span role="status">Processing…</span>}
    </div>
    {open && <div id="recruiter-details" className="mt-3 space-y-3">
      <p className="text-xs text-emerald-100/70">Upload, paste or dictate your requirements, then ask any question about Bharat’s fit. Requirements are sent to the AI provider for this chat and expire after one hour or a server restart.</p>
      <input ref={fileInput} type="file" accept=".pdf,.docx,.txt" className="hidden" aria-label="Upload job description" disabled={disabled || busy || listening} onChange={event => { const file = event.target.files?.[0]; if (file) void save(file); }} />
      <button type="button" disabled={disabled || busy || listening} onClick={() => fileInput.current?.click()} className="flex items-center gap-2 rounded-lg border border-emerald-300/30 px-3 py-2 disabled:opacity-50"><FileUp size={16} /> Upload PDF / Word / TXT · up to 5 MB</button>
      <textarea value={text} disabled={disabled || busy} onChange={event => setText(event.target.value)} maxLength={24000} rows={4}
        aria-label="Job description and requirements" placeholder="Paste the job description, must-have skills, responsibilities and any other requirements…"
        className="w-full resize-y rounded-lg border border-emerald-300/25 bg-black/20 p-3 text-white outline-none focus:border-emerald-300" />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={dictate} disabled={disabled || busy} className="flex items-center gap-2 rounded-lg border border-emerald-300/30 px-3 py-2 disabled:opacity-50"><Mic size={15} />{listening ? "Stop dictation" : "Dictate requirements"}</button>
        <button type="button" disabled={disabled || busy || listening || text.trim().length < 20} onClick={() => save()} className="rounded-lg bg-emerald-700 px-3 py-2 disabled:opacity-50">{context ? "Replace requirements" : "Attach requirements"}</button>
        <span className="text-xs text-emerald-100/60">{text.length.toLocaleString()} / 24,000</span>
      </div>
      <p className="text-xs text-emerald-100/60">Use a searchable PDF or DOCX. For scans, paste the extracted text. Replacing requirements starts a fresh assessment while keeping earlier messages visible.</p>
    </div>}
    {notice && <p role="status" className="mt-2 text-xs text-amber-100">{notice}</p>}
  </section>;
}
