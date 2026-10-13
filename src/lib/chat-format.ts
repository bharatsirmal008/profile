/** Hide model-added document citations while preserving the actual answer. */
export function hideDocumentSources(text: string): string {
  return text
    .replace(/(^|\n)[ \t>*#_-]*\*{0,2}(?:sources?|स्रोत|स्रोतहरू)\*{0,2}\s*:[^\n]*/gi, "$1")
    .replace(/\*{0,2}(?:sources?|स्रोत|स्रोतहरू)\s*:[^\n]*\.pdf[^\n]*/gi, "")
    .replace(/\s*[([{][^()\[\]{}\n]*\.pdf[^()\[\]{}\n]*[)\]}]/gi, "")
    .replace(/\b(?:Bharat_Sirmal_[\w.-]*|Resume)\.pdf\b/gi, "")
    .replace(/\n{3,}/g, "\n\n");
}

/** Convert common model formatting tags to Markdown, preserving code literally. */
export function normalizeAnswer(text: string): string {
  let fence: string | null = null;
  return text.split("\n").map(line => {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return line;
    }
    if (fence) return line;
    return hideDocumentSources(line).split(/(`+[^`]*`+)/g).map((part, index) => {
      if (index % 2) return part;
      return part
        .replace(/&lt;(\/?(?:br|p|div|strong|b|em|i|h[1-6]|ul|ol|li))\s*\/?&gt;/gi, "<$1>")
        .replace(/<br\s*\/?\s*>/gi, /^\s*\|/.test(line) ? " · " : "  \n")
        .replace(/<\/?(?:strong|b)(?:\s[^>]*)?>/gi, "**")
        .replace(/<\/?(?:em|i)(?:\s[^>]*)?>/gi, "*")
        .replace(/<h([1-6])(?:\s[^>]*)?>/gi, (_, level) => "\n\n" + "#".repeat(Number(level)) + " ")
        .replace(/<\/h[1-6]>/gi, "\n\n")
        .replace(/<li(?:\s[^>]*)?>/gi, "\n- ")
        .replace(/<\/li>/gi, "\n")
        .replace(/<\/?(?:p|div|ul|ol)(?:\s[^>]*)?>/gi, "\n\n")
        .replace(/<\/?span(?:\s[^>]*)?>/gi, "");
    }).join("");
  }).join("\n");
}

type ChatMessage = { id: string; role: "user" | "ai"; content: string };

/** The edited user turn and all its dependent answers are replaced on resend. */
export function conversationPrefix<T extends ChatMessage>(messages: T[], editId?: string): T[] {
  if (!editId) return messages;
  const index = messages.findIndex(message => message.id === editId && message.role === "user");
  if (index < 0) throw new Error("The message to edit is no longer in this chat.");
  return messages.slice(0, index);
}

export function requestHistory(messages: ChatMessage[]) {
  let budget = 24000;
  const history: { role: "user" | "assistant"; content: string }[] = [];
  for (const message of messages.filter(message => message.id !== "1" && message.content.trim()).slice(-12).reverse()) {
    if (budget <= 0) break;
    const content = message.content.slice(-Math.min(12000, budget));
    history.unshift({ role: message.role === "user" ? "user" : "assistant", content });
    budget -= content.length;
  }
  return history;
}
