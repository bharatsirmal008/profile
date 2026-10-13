export type ChatAttachment = { id: string; name: string; size: number; type: string; revision?: string };
export const ACCEPTED_FILES = ".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp";
export const isImageAttachment = (file: Pick<ChatAttachment, "name">) => /\.(png|jpe?g|webp)$/i.test(file.name);

export function validateAttachment(file: Pick<File, "name" | "size">) {
  if (!/\.(pdf|docx|txt|png|jpe?g|webp)$/i.test(file.name)) throw new Error("Choose PDF, Word DOCX, TXT, PNG, JPEG or WebP. Convert older DOC files to DOCX.");
  if (!file.size || file.size > 5 * 1024 * 1024) throw new Error("Choose a non-empty file up to 5 MB.");
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("bharat-ai-attachments", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("File storage is unavailable in this browser."));
  });
}

export async function saveAttachment(file: File): Promise<ChatAttachment> {
  validateAttachment(file);
  const attachment = { id: crypto.randomUUID(), name: file.name, size: file.size, type: file.type };
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction("files", "readwrite");
      transaction.objectStore("files").put(file, attachment.id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = transaction.onabort = () => reject(new Error("Could not store this file. Check available browser storage."));
    });
  } finally { database.close(); }
  return attachment;
}

export async function readAttachment(id: string): Promise<Blob | undefined> {
  const database = await openDatabase();
  try {
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const request = database.transaction("files").objectStore("files").get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Could not reopen this attachment."));
    });
  } finally { database.close(); }
}

export async function deleteAttachment(id: string): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction("files", "readwrite");
      transaction.objectStore("files").delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = transaction.onabort = () => reject(new Error("Could not remove the attachment."));
    });
  } finally { database.close(); }
}
