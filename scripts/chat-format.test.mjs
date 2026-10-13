import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeAnswer, conversationPrefix, requestHistory } from "../src/lib/chat-format.ts";

const render = text => renderToStaticMarkup(React.createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], skipHtml: true }, normalizeAnswer(text)));

test("job assessment renders a real table, including HTML line breaks in cells", () => {
  const html = render("| Criterion | Evidence | Rating |\n|---|---|---|\n| Backend | Python<br>FastAPI | 4 |\n| Database | PostgreSQL | Unknown |");
  assert.match(html, /<table>/);
  assert.match(html, /<th>Criterion<\/th>/);
  assert.match(html, /<td>Python · FastAPI<\/td>/);
  assert.equal((html.match(/<tr>/g) || []).length, 3);
  assert.doesNotMatch(html, /&lt;br/);
});

test("formatting tags and encoded tags become clean readable content", () => {
  const html = render("<h2>Assessment</h2>\n<p><strong>Evidence</strong><br/>Python</p>\n&lt;br&gt;Next point");
  assert.match(html, /<h2>Assessment<\/h2>/);
  assert.match(html, /<strong>Evidence<\/strong>/);
  assert.match(html, /Next point/);
  assert.doesNotMatch(html, /&lt;(?:br|p|strong)/);
});

test("literal code and unfinished streamed fences keep HTML examples unchanged", () => {
  const source = "Use `<br>` literally.\n```html\n<div>example</div>\n<br>";
  assert.equal(normalizeAnswer(source), source);
  assert.equal(normalizeAnswer("~~~html\n<p>example</p>\n~~~"), "~~~html\n<p>example</p>\n~~~");
});

test("unknown executable HTML is not rendered into the page", () => {
  const html = render('<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\nUseful answer');
  assert.doesNotMatch(html, /<script|<img|onerror=/);
  assert.match(html, /Useful answer/);
});

test("edit and resend removes the edited turn and all dependent replies from history", () => {
  const messages = [
    { id: "1", role: "ai", content: "Welcome" },
    { id: "u1", role: "user", content: "Our job requires Python" },
    { id: "a1", role: "ai", content: "Python evidence" },
    { id: "u2", role: "user", content: "Can he handle production?" },
    { id: "a2", role: "ai", content: "Old answer" },
  ];
  const prefix = conversationPrefix(messages, "u2");
  assert.deepEqual(prefix.map(message => message.id), ["1", "u1", "a1"]);
  assert.deepEqual(requestHistory(prefix), [
    { role: "user", content: "Our job requires Python" },
    { role: "assistant", content: "Python evidence" },
  ]);
  assert.equal(messages.length, 5);
  assert.throws(() => conversationPrefix(messages, "missing"));
  assert.deepEqual(conversationPrefix(messages, "u1").map(message => message.id), ["1"]);
});

test("request history is bounded by both message count and API character limits", () => {
  const messages = Array.from({ length: 20 }, (_, i) => ({ id: `m${i}`, role: i % 2 ? "ai" : "user", content: `${i}:` + "x".repeat(13000) }));
  const history = requestHistory(messages);
  assert.ok(history.length <= 12);
  assert.ok(history.every(message => message.content.length <= 12000));
  assert.ok(history.reduce((length, message) => length + message.content.length, 0) <= 24000);
});
