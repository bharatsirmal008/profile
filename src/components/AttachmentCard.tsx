"use client";

import { useEffect, useState } from "react";
import { FileText, ImageIcon, X } from "lucide-react";
import { isImageAttachment, readAttachment, type ChatAttachment } from "../lib/attachment-store";

export function AttachmentCard({ attachment, onRemove, disabled }: {
  attachment: ChatAttachment; onRemove?: () => void; disabled?: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const image = isImageAttachment(attachment);
  useEffect(() => {
    let live = true;
    let objectUrl: string | null = null;
    readAttachment(attachment.id).then(blob => {
      if (!live) return;
      if (!blob) { setUnavailable(true); return; }
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch(() => { if (live) setUnavailable(true); });
    return () => { live = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [attachment.id]);
  const contents = <>
    {image && url ? <div role="img" aria-label={attachment.name} className="h-24 w-full rounded-lg bg-black/30 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${url})` }} /> : image ? <ImageIcon className="h-6 w-6 shrink-0 text-emerald-300"/> : <FileText className="h-7 w-7 shrink-0 text-emerald-300"/>}
    <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{attachment.name}</p>
      <p className="text-xs text-emerald-100/60">{attachment.name.split(".").pop()?.toUpperCase()} · {Math.max(1, Math.round(attachment.size / 1024))} KB{unavailable ? " · Preview unavailable on this browser" : ""}</p></div>
  </>;
  return <div className="relative w-full max-w-[300px] rounded-xl border border-emerald-300/25 bg-[#0b231c] p-3">
    {url ? <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${attachment.name}`} className={`flex min-w-0 gap-3 ${image ? "flex-col" : "items-center"} ${onRemove ? "pr-6" : ""}`}>{contents}</a>
      : <div className={`flex min-w-0 gap-3 ${image ? "flex-col" : "items-center"} ${onRemove ? "pr-6" : ""}`}>{contents}</div>}
    {onRemove && <button type="button" disabled={disabled} onClick={onRemove} aria-label={`Remove ${attachment.name}`} className="absolute right-2 top-2 rounded-full bg-black/40 p-1 text-gray-300 hover:text-white disabled:opacity-40"><X size={14}/></button>}
  </div>;
}
