import { cloudEnabled, getSupabase } from "./supabase";
import type { VoiceConfig, VoiceLanguage, SpokenLanguage } from "./voice-settings";

export type VoiceHistoryMessage = { role: "user" | "assistant"; content: string };
export type VoiceStart = { chat_ref: string; language: VoiceLanguage; voice_id?: string; history: VoiceHistoryMessage[]; context_revision?: string };
export type VoiceCredentials = { session_id: string; conversation_token: string; expires_at: number; language: VoiceLanguage; active_language: SpokenLanguage; voice_id: string | null };

export async function voiceRequest<T>(base: string, path: string, token?: string, body?: unknown, signal?: AbortSignal, method?: string): Promise<T> {
  const response = await fetch(`${base}/api/voice/${path}`, {
    method: method || (body === undefined ? "GET" : "POST"), cache: "no-store", signal,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(typeof error.detail === "string" ? error.detail : "Voice connection failed. Please retry.");
  }
  return response.json();
}

export async function voiceAccessToken(config: VoiceConfig): Promise<string> {
  if (!cloudEnabled) throw new Error("Voice sign-in is awaiting configuration. Text chat still works.");
  const client = getSupabase();
  let { data: { session }, error } = await client.auth.getSession();
  if (error) throw new Error("Your login is unavailable. Please sign in again.");
  if (!session && config.allow_anonymous) {
    const result = await client.auth.signInAnonymously();
    session = result.data.session;
    error = result.error;
  }
  if (error || !session) throw new Error("Sign in to use real-time voice, or ask Bharat to enable visitor voice access.");
  // This token is only forwarded. The backend verifies identity with Supabase getUser.
  return session.access_token;
}

/** Generation fence prevents rapid stop/start from adopting stale network results. */
export class VoiceAttempt {
  private generation = 0;
  private controller: AbortController | null = null;
  begin() {
    this.cancel();
    const generation = this.generation;
    this.controller = new AbortController();
    return { signal: this.controller.signal, current: () => this.generation === generation };
  }
  cancel() { this.generation++; this.controller?.abort(); this.controller = null; }
}
