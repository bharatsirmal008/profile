import test from "node:test";
import assert from "node:assert/strict";
import { validateAttachment, isImageAttachment, ACCEPTED_FILES } from "../src/lib/attachment-store.ts";
import { conversationPrefix, requestHistory } from "../src/lib/chat-format.ts";

test("picker accepts documents and common images with size validation", () => {
  for (const name of ["job.pdf", "job.DOCX", "job.txt", "job.PNG", "photo.jpeg", "photo.webp"]) {
    assert.doesNotThrow(() => validateAttachment({ name, size: 1024 }));
    assert.ok(ACCEPTED_FILES.includes(`.${name.toLowerCase().split('.').pop()}`));
  }
  for (const file of [{ name: "script.svg", size: 12 }, { name: "job.pdf", size: 0 }, { name: "job.pdf", size: 5 * 1024 * 1024 + 1 }]) assert.throws(() => validateAttachment(file));
  assert.ok(isImageAttachment({ name: "screenshot.PNG" }));
  assert.ok(!isImageAttachment({ name: "job.pdf" }));
});

test("attachments stay on visible messages through edit branching; history contains text only", () => {
  const attachment = { id: "file1", name: "job.pdf", size: 512, type: "application/pdf" };
  const messages = [{ id: "u1", role: "user", content: "Analyze this job", attachments: [attachment] }, { id: "a1", role: "ai", content: "Assessment" }, { id: "u2", role: "user", content: "What are the gaps?" }];
  const prefix = conversationPrefix(messages, "u2");
  assert.deepEqual(prefix[0].attachments, [attachment]);
  assert.ok(requestHistory(prefix).every(message => !("attachments" in message)));
  assert.deepEqual(JSON.parse(JSON.stringify(messages))[0].attachments, [attachment]);
});
