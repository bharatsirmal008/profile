import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { parseVoiceSettings, DEFAULT_VOICE_SETTINGS, voicePhase, transcriptId } from '../src/lib/voice-settings.ts';

function transport({ fetch = async () => ({ ok: true, json: async () => ({ ok: true }) }), auth = {} } = {}) {
  const code = ts.transpileModule(fs.readFileSync('src/lib/voice-session.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, AbortController, fetch, require: () => ({ cloudEnabled: true, getSupabase: () => ({ auth }) }) });
  return exports;
}

test('voice preferences handle malformed storage and clamp volume without accepting arbitrary language codes', () => {
  assert.deepEqual(parseVoiceSettings('{bad'), DEFAULT_VOICE_SETTINGS);
  assert.deepEqual(parseVoiceSettings('null'), DEFAULT_VOICE_SETTINGS);
  assert.equal(parseVoiceSettings('{"volume":9,"language":"fr"}').volume, 1);
  assert.equal(parseVoiceSettings('{"language":"auto","subtitles":false}').language, 'auto');
  assert.equal(parseVoiceSettings('{"language":"ne"}').language, 'ne');
});

test('voice state follows events through interruption, mute, failure and explicit reconnect', () => {
  let state = voicePhase('idle', { type: 'start' });
  state = voicePhase(state, { type: 'connect' });
  assert.equal(state, 'listening');
  state = voicePhase(state, { type: 'user' });
  assert.equal(state, 'user-speaking');
  state = voicePhase(state, { type: 'thinking' });
  state = voicePhase(state, { type: 'speak' });
  assert.equal(state, 'speaking');
  assert.equal(voicePhase(state, { type: 'interrupt' }), 'listening');
  assert.equal(voicePhase('muted', { type: 'user' }), 'muted');
  assert.equal(voicePhase('muted', { type: 'unmute' }), 'listening');
  assert.equal(voicePhase('error', { type: 'speak' }), 'error');
  assert.equal(voicePhase('ended', { type: 'connect' }), 'ended');
  assert.equal(voicePhase('error', { type: 'start' }), 'connecting');
});

test('stable transcript IDs deduplicate resends and keep different sessions separate', () => {
  assert.equal(transcriptId('a', 'ai', 1, 'response'), transcriptId('a', 'ai', 2, 'response'));
  assert.notEqual(transcriptId('a', 'user', 1), transcriptId('b', 'user', 1));
});

test('rapid stop/start invalidates stale session results and aborts pending work', () => {
  const { VoiceAttempt } = transport();
  const runner = new VoiceAttempt();
  const first = runner.begin();
  const second = runner.begin();
  assert.equal(first.current(), false);
  assert.equal(first.signal.aborted, true);
  assert.equal(second.current(), true);
  runner.cancel();
  assert.equal(second.current(), false);
});

test('session requests carry auth, use no-store, and never place tokens in URLs', async () => {
  const calls = [];
  const { voiceRequest } = transport({ fetch: async (...args) => { calls.push(args); return { ok: true, json: async () => ({ session: 'bound' }) }; } });
  await voiceRequest('https://backend.invalid', 'session', 'access-token', { chat_ref: 'chat', language: 'hi' });
  const [url, options] = calls[0];
  assert.equal(url, 'https://backend.invalid/api/voice/session');
  assert.equal(options.headers.Authorization, 'Bearer access-token');
  assert.equal(options.cache, 'no-store');
  assert.equal(JSON.parse(options.body).language, 'hi');
});

test('provider setup and expired login errors reach the user without treating them as answers', async () => {
  const { voiceRequest } = transport({ fetch: async () => ({ ok: false, json: async () => ({ detail: 'Real-time voice is not configured yet.' }) }) });
  await assert.rejects(voiceRequest('https://backend.invalid', 'session', 'token', {}), /not configured/);
});

test('existing authenticated login is reused without signing in a new visitor', async () => {
  const { voiceAccessToken } = transport({ auth: { getSession: async () => ({ data: { session: { access_token: 'existing' } }, error: null }), signInAnonymously: () => { throw Error('must not replace login'); } } });
  assert.equal(await voiceAccessToken({ allow_anonymous: true }), 'existing');
});

test('visitor identity creation is only attempted when server explicitly enables it', async () => {
  let anonymousCalls = 0;
  const { voiceAccessToken } = transport({ auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInAnonymously: async () => { anonymousCalls++; return { data: { session: { access_token: 'visitor' } }, error: null }; },
  } });
  await assert.rejects(voiceAccessToken({ allow_anonymous: false }), /Sign in/);
  assert.equal(anonymousCalls, 0);
  assert.equal(await voiceAccessToken({ allow_anonymous: true }), 'visitor');
  assert.equal(anonymousCalls, 1);
});
