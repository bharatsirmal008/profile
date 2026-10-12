import type { jsPDF } from "jspdf";
import type { ResumeData } from "./resume-data";

// Use selectable vector text rather than capturing a scrollable window: a
// screenshot can omit entries outside the visible part of the resume.
const clean = (text: string) => text.replace(/\\n/g, " ").replace(/[–—‑]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();

function layout(doc: jsPDF, data: ResumeData, scale: number, draw: boolean) {
  const left = 36;
  const right = doc.internal.pageSize.getWidth() - left;
  const width = right - left;
  const body = 10 * scale;
  const lineHeight = body * 1.14;
  let y = 37;
  const font = (size = body, style = "normal") => {
    doc.setFont("times", style);
    doc.setFontSize(size);
  };
  const paragraph = (text: string, style = "normal", inset = 0, available = width - inset) => {
    if (!clean(text)) return;
    font(body, style);
    const lines: string[] = doc.splitTextToSize(clean(text), available);
    if (draw) doc.text(lines, left + inset, y, { lineHeightFactor: 1.14 });
    y += lines.length * lineHeight;
  };

  font(25 * scale, "bold");
  const nameLines: string[] = doc.splitTextToSize(clean(data.name).toUpperCase(), width);
  if (draw) doc.text(nameLines, (left + right) / 2, y, { align: "center", lineHeightFactor: 1.1 });
  y += nameLines.length * 27.5 * scale;

  font(9 * scale);
  const contacts = [
    { text: data.email, url: `mailto:${data.email}` },
    { text: data.linkedin ? "LinkedIn" : "", url: data.linkedin },
    { text: data.github ? "GitHub" : "", url: data.github },
    { text: data.portfolio ? "Portfolio" : "", url: data.portfolio },
    { text: data.location, url: "" },
  ].filter(item => item.text);
  const separator = " | ";
  const contactWidth = contacts.reduce((sum, item) => sum + doc.getTextWidth(clean(item.text)), 0) + Math.max(0, contacts.length - 1) * doc.getTextWidth(separator);
  // Wrap long custom contact details without clipping the page edges.
  if (contactWidth > width) {
    paragraph(contacts.map(item => item.text).join(separator));
  } else {
    let x = (left + right - contactWidth) / 2;
    for (let i = 0; i < contacts.length; i++) {
      const item = contacts[i];
      const text = clean(item.text);
      if (draw) {
        const linked = /^(https?:\/\/|mailto:)/i.test(item.url);
        doc.setTextColor(linked ? "#125bd5" : "#000000");
        doc.text(text, x, y);
        if (linked) doc.link(x, y - 9 * scale, doc.getTextWidth(text), 11 * scale, { url: item.url });
      }
      x += doc.getTextWidth(text);
      if (i < contacts.length - 1) {
        if (draw) { doc.setTextColor("#000000"); doc.text(separator, x, y); }
        x += doc.getTextWidth(separator);
      }
    }
    y += 12 * scale;
  }
  doc.setTextColor("#000000");

  for (const section of data.sections) {
    y += 7 * scale;
    font(12 * scale, "bold");
    const heading: string[] = doc.splitTextToSize(clean(section.title).toUpperCase(), width);
    if (draw) doc.text(heading, left, y, { lineHeightFactor: 1.14 });
    y += heading.length * 13.7 * scale;
    if (draw) { doc.setLineWidth(0.65); doc.line(left, y - 7 * scale, right, y - 7 * scale); }
    y += 1 * scale;
    for (const entry of section.entries) {
      if (section.id === "skills") {
        // Keep each skill category inline, with only the label in bold.
        let x = left;
        const parts = [
          { text: `${clean(entry.title).replace(/:\s*$/, "")}:`, style: "bold" },
          { text: [entry.subtitle, ...entry.details, entry.date === ":" ? "" : entry.date].map(clean).filter(Boolean).join(" "), style: "normal" },
        ];
        for (const part of parts) {
          font(body, part.style);
          for (const word of part.text.split(/\s+/).filter(Boolean)) {
            const fragments: string[] = doc.splitTextToSize(word, width);
            for (const fragment of fragments) {
              const wordWidth = doc.getTextWidth(fragment);
              if (x > left && x + wordWidth > right) { x = left; y += lineHeight; }
              if (draw) doc.text(fragment, x, y);
              x += wordWidth + doc.getTextWidth(" ");
            }
          }
        }
        y += lineHeight + 1 * scale;
        continue;
      }
      font(body, "italic");
      const dateWidth = entry.date ? Math.min(width / 3, doc.getTextWidth(clean(entry.date))) : 0;
      const entryStart = y;
      paragraph(entry.title, "bold", 0, width - (dateWidth ? dateWidth + 12 : 0));
      if (entry.date) {
        font(body, "italic");
        const dates: string[] = doc.splitTextToSize(clean(entry.date), width / 3);
        if (draw) doc.text(dates, right, entryStart, { align: "right", lineHeightFactor: 1.14 });
        y = Math.max(y, entryStart + dates.length * lineHeight);
      }
      paragraph(entry.subtitle);
      for (const detail of entry.details) {
        if (!clean(detail)) continue;
        if (entry.bullets && draw) { font(); doc.text("•", left + 2, y); }
        paragraph(detail, "normal", entry.bullets ? 11 : 0);
      }
      y += 3 * scale;
    }
  }
  return y;
}

export async function createResumePdf(data: ResumeData) {
  // Load the PDF library only when a visitor requests a download.
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const bottom = doc.internal.pageSize.getHeight() - 30;
  // Measure all sections first; fit the complete resume onto one page without
  // skipping projects, truncating bullets, or depending on the window's height.
  let low = 0.1;
  let high = 1;
  for (let i = 0; i < 20; i++) {
    const candidate = (low + high) / 2;
    if (layout(doc, data, candidate, false) <= bottom) low = candidate;
    else high = candidate;
  }
  if (layout(doc, data, low, false) > bottom) throw new Error("Resume is too large for one page.");
  layout(doc, data, low, true);
  doc.setProperties({ title: `${data.name} - Resume`, author: data.name, subject: "Professional resume" });
  return doc;
}
