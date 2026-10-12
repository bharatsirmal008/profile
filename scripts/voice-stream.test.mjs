import test from 'node:test';
import assert from 'node:assert/strict';
import { SentenceBuffer, StreamingSpeech, readAnswerStream } from '../src/lib/voice-stream.ts';

function setup() {
  const played = [];
  let completed = 0;
  let firstAudio = 0;
  const speech = new StreamingSpeech({
    synth: { speak: u => played.push(u), cancel() {}, getVoices: () => [] },
    createUtterance: text => ({ text }),
    onSpeaking() {}, onPulse() {},
    onDone: () => completed++, onFirstAudio: () => firstAudio++,
  });
  return { speech, played, get completed() { return completed; }, get firstAudio() { return firstAudio; } };
}

test('speaks first complete sentence before the text stream finishes', () => {
  const t = setup();
  t.speech.append('First answer. Next');
  assert.equal(t.played[0].text, 'First answer.');
  t.played[0].onstart();
  t.played[0].onend();
  assert.equal(t.completed, 0); // The microphone must stay off between chunks.
  t.speech.append(' sentence. ');
  assert.equal(t.played[1].text, 'Next sentence.');
  t.speech.finish();
  assert.equal(t.completed, 0); // Wait for actual playback to end.
  t.played[1].onstart();
  t.played[1].onend();
  assert.equal(t.completed, 1);
  assert.equal(t.firstAudio, 1);
});

test('cancellation blocks queued text and late browser callbacks', () => {
  const t = setup();
  t.speech.append('First sentence. Second sentence. ');
  t.speech.cancel();
  t.played[0].onend();
  t.speech.append('A late token. ');
  t.speech.finish();
  assert.equal(t.played.length, 1);
  assert.equal(t.completed, 0);
});

test('finish speaks trailing text once even without punctuation or loaded voices', () => {
  const t = setup();
  t.speech.append('Final words without punctuation');
  assert.equal(t.played.length, 0);
  t.speech.finish();
  t.speech.finish();
  assert.equal(t.played[0].text, 'Final words without punctuation');
  t.played[0].onend();
  assert.equal(t.completed, 1);
});

test('sentence buffering preserves decimal numbers, abbreviations and split tokens', () => {
  const b = new SentenceBuffer();
  assert.deepEqual(b.push('Dr. Sirmal scored 8.'), []);
  assert.deepEqual(b.push('74. Next'), ['Dr. Sirmal scored 8.74.']);
  assert.deepEqual(b.push(' sentence', true), ['Next sentence']);
});

test('long unpunctuated output starts speaking without waiting for EOF', () => {
  const b = new SentenceBuffer();
  assert.ok(b.push('word '.repeat(50)).length > 0);
});

function byteStream(text) {
  const bytes = new TextEncoder().encode(text);
  // Deliberately split UTF-8 characters and JSON lines across reads.
  return new ReadableStream({ start(controller) {
    for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
    controller.close();
  } });
}

test('NDJSON preserves fragmented Unicode, ignores timing events, handles final line', async () => {
  let answer = '';
  let metrics;
  await readAnswerStream(byteStream(
    '{"type":"token","token":"नमस्ते"}\n{"type":"metrics","first_token_ms":12}\n{"type":"done"}'
  ), token => { answer += token; }, event => { metrics = event; });
  assert.equal(answer, 'नमस्ते');
  assert.equal(metrics.first_token_ms, 12);
});

test('server error is surfaced rather than spoken as an answer', async () => {
  let answer = '';
  await assert.rejects(readAnswerStream(byteStream(
    '{"type":"token","token":"Partial"}\n{"type":"error","error":"Unavailable","token":"Unavailable"}\n'
  ), token => { answer += token; }, () => {}), /Unavailable/);
  assert.equal(answer, 'Partial');
});

test('unexpected EOF is reported so partial output is not treated as complete', async () => {
  await assert.rejects(readAnswerStream(byteStream('{"type":"token","token":"partial"}\n'), () => {}, () => {}), /interrupted/);
});
