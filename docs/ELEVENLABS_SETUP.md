# JOJO real-time voice: implementation and later setup

Status: application integration implemented for offline verification. **No live ElevenLabs sessions, pronunciation tests, account/pricing checks or latency benchmarks have been performed.** Keep voice disabled until the acceptance checklist below passes.

## Architecture

```text
Existing Next.js assistant
  -> lazy-loaded @elevenlabs/react 1.18.0 ConversationProvider
  -> backend-authenticated WebRTC token
  -> ElevenLabs ASR / turn detection / interruption / audio output
  -> authenticated /api/voice/v1/chat/completions SSE adapter
  -> existing Groq + Chroma PDF retrieval + recruiter context
  -> SDK output audio levels drive the existing emerald orb
```

The backend is FastAPI, not Node/Express. The existing `/ask` route still emits NDJSON and is unchanged. The new endpoint implements OpenAI **Chat Completions streaming** (not Responses), with text deltas, language-detection tool calls, finish reasons and `[DONE]`. Incoming provider system/developer messages cannot override the existing Bharat policy.

Each voice session has a server-verified Supabase user, an unguessable ID, isolated `voice:<id>` memory and a ten-minute lifetime. The browser sends a bounded snapshot of the current chat history. When attaching recruiter context it must supply both the current legacy private chat reference and its revision capability; stale context is rejected and copied into the new isolated session. Ordinary text chat and legacy recruiter APIs keep their existing authentication behavior; this change does not convert their browser session IDs into authenticated accounts.

Session creation is rate limited by verified owner and direct client IP, with one active voice session per owner. The provider adapter additionally requires a private bearer secret and a live session binding. Never expose that secret or the ElevenLabs API key as `NEXT_PUBLIC_*` variables.

## Files

Backend:

- `voice.py`: configuration, verified identity, session reservation/token issuance, bounds/limits, transcript events, end/history deletion, language identification, custom LLM SSE and cancellation.
- `voice_store.py`: private SQLite metadata and text history, deduplication/corrections, retention.
- `voice_languages.json`: canonical language labels/codes served through `/api/voice/config` to the frontend.
- `main.py`: mounts the voice router without changing existing endpoints.
- `retrieve.py`: optional strict language for verified voice requests; normal chat behavior stays the same.
- `.env.example`: safe empty configuration, disabled by default.
- `tests/test_voice.py`: offline voice/security/protocol regressions.
- `docs/VOICE_AUDIT.md`: repository audit and compatibility decisions.

Frontend (separate `profile` repository):

- `src/components/assistant/ElevenLabsVoice.tsx`: SDK transport, local settings, transcripts and lifecycle.
- `src/components/assistant/VoiceInterface.tsx` / `.module.css`: optional controls/subtitles and SDK audio visualization around the existing scene.
- `src/components/assistant/Assistant.tsx`: lazy voice entry, bounded context snapshot and message history integration.
- `src/lib/voice-session.ts`: authenticated requests, access-token retrieval and stale-attempt guard.
- `src/lib/voice-settings.ts`: preference validation, state transitions and stable transcript IDs.
- `tests/voice-session.test.mjs`: offline transport/settings/identity contracts.
- `package.json` / `package-lock.json`: pinned official SDK.

## Installation and local commands

From `profile`:

```powershell
npm ci
# SDK is already in package.json. To install it explicitly in another checkout:
npm install --save-exact @elevenlabs/react@1.18.0
npm test
npm run typecheck
npm run build
npm run start
```

From `personal-ai-assistant/backend`:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m unittest discover -s tests
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

The backend uses already installed FastAPI, requests, Pydantic, Groq, AnyIO and Python's built-in sqlite3; no new Python provider SDK is needed. Add to the frontend `.env.local` for local integration and rebuild/restart:

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SUPABASE_URL=<your existing project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your existing public key>
```

Do not overwrite existing `.env` files. Copy only the needed empty entries from the backend `.env.example` and fill them privately. Without configured services, voice mode shows a setup message and offers the existing browser voice path. No automatic microphone capture or paid session starts on opening the window.

## Required backend variables

| Variable | Purpose |
| --- | --- |
| `VOICE_ENABLED` | Keep `false` until the checks pass; `true` enables token issuance. |
| `ELEVENLABS_API_KEY` | Restricted server-only ElevenLabs key permitted to issue agent tokens. |
| `VOICE_LLM_SECRET` | Random secret also stored as the ElevenLabs Custom LLM API key. |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Existing project's server-side identity verification configuration. No service-role key needed. |
| `VOICE_ALLOWED_ORIGINS` | Exact comma-separated frontend origins; no wildcard. |
| `VOICE_ALLOW_ANONYMOUS` | Optional authenticated visitor identities; defaults to `false`. |
| `VOICE_ALLOWED_USER_IDS` | Optional allowlist for a private beta. |
| `VOICE_TEST_MODE` | Private live testing of unverified agents; requires a non-empty verified user-ID allowlist. Default `false`. |
| `ELEVENLABS_AGENT_ID_EN/HI/NE/AUTO` | Dashboard agent IDs; language-specific agents can use different TTS capabilities. |
| `ELEVENLABS_TTS_MODEL_EN/HI/NE/AUTO` | Record the model actually configured in each dashboard agent. These do not modify dashboard models. |
| `ELEVENLABS_VOICE_ID_EN/HI/NE` | Optional verified voice override. Leave blank to use the agent voice. |
| `VOICE_VERIFIED_EN/HI/NE/AUTO` | Set each to `true` only after its live acceptance checks. All default to `false`. |
| `VOICE_LANGUAGE_MODEL` | Optional available Groq classifier model; defaults to the existing model. |
| `VOICE_DB_PATH` | Private persistent SQLite path; defaults to ignored `backend/runtime/voice.sqlite3`. |
| `VOICE_RETENTION_DAYS` | Text retention, default seven days, range 1–365. |

Generate the provider adapter secret locally, then store it privately:

```powershell
.\venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(48))"
```

## ElevenLabs dashboard setup — do later

1. Check your account's current Agents access, concurrency, supported ASR/TTS models and price. This implementation makes no assumption about plan eligibility or pricing.
2. Create private agents for the languages you will test. Enable agent authentication. Use the selected language as each agent's default. Choose voices by listening to native-language samples; a language-capable model alone does not verify pronunciation.
3. Select an Agents-compatible ASR configuration that supports the chosen language. Official documentation lists Nepali for Scribe, but verify availability in your actual agent/runtime.
4. Choose a verified streaming TTS model in each agent. Flash v2.5 supports English/Hindi but must not be used for Nepali. Newer multilingual families list Nepali; confirm their availability inside your account's Agents runtime before selecting one. Leave unsupported languages disabled.
5. Select **Custom LLM / Chat Completions**. Set the public HTTPS base URL to `https://YOUR-BACKEND/api/voice/v1` (the endpoint is `/api/voice/v1/chat/completions`). Confirm in provider logs that exactly this full path is requested; some dashboard versions ask for the complete endpoint instead of a base URL. Use model ID `bharat-voice` and streaming.
6. Store `VOICE_LLM_SECRET` in the dashboard's secret store and select it as the Custom LLM API key so requests carry `Authorization: Bearer <secret>`. Do not put your Groq key in this field.
7. Allow the session's custom LLM extra body to reach the custom server. React SDK 1.18.0 uses `customLlmExtraBody: { voice_session_id }`; the server receives `elevenlabs_extra_body.voice_session_id`. Missing binding is rejected. Check this contract with a real session before enabling access.
8. Enable the **language_detection** system tool if you want explicit spoken switches. This adapter supports that system tool only; do not enable arbitrary server-action tools, transfers or other system tools expecting general function calling. It preserves your existing document/recruiter services internally.
9. For optional Auto mode, configure a multilingual agent with English/Hindi/Nepali language presets, verified ASR/TTS/voices and the language-detection tool. A Groq JSON language classifier distinguishes code switching/Romanized Nepali and asks for clarification below its confidence threshold. Language changes stream a supported system-tool call to switch audio, rather than only translating text. Test tool failure handling in your account; keep Auto disabled if switching is unreliable. Separate agents remain the manual fallback.
10. Allow voice-ID overrides only if using the optional curated voice selector. Configure agent voice IDs consistently with the server allowlist.
11. Enable interruption/barge-in and configure turn detection. Set a provider-side **maximum conversation duration of 600 seconds**. Backend expiry blocks subsequent LLM requests; it cannot alone force a malicious browser's provider connection to end.
12. Disable provider audio recording/storage and unnecessary transcript retention in the dashboard if available for your plan. The application never persists raw microphone audio, but provider-side retention must be configured separately.
13. Fill agent/model/voice environment values. For the first live checks, set `VOICE_TEST_MODE=true`, restrict `VOICE_ALLOWED_USER_IDS` to your own verified Supabase user ID and enable `VOICE_ENABLED=true`. This private mode explicitly labels language quality as unverified and cannot run without an allowlist. After testing, set only the passing language flags to `true`, then set `VOICE_TEST_MODE=false`. Expand access only after verification.

## Supabase identity setup

Existing signed-in users reuse their current access token. The backend verifies it via `/auth/v1/user`; client-supplied IDs and editable user metadata are not authorization.

For public recruiters/visitors, optionally enable Supabase **anonymous sign-ins** and its recommended abuse protection/CAPTCHA policies, then set `VOICE_ALLOW_ANONYMOUS=true`. Starting voice explicitly creates an authenticated anonymous identity only if no existing session exists. Keep it disabled if you prefer signed-in users only. Enabling visitor access can incur provider costs; use the user allowlist for initial testing.

No Supabase table migration is required. This pass does not add a new login screen or replace the existing admin login.

## Storage and operational boundaries

- SQLite schema is initialized idempotently when the first voice session is created. It records owner, chat reference, provider conversation ID, status/timestamps/error code and text events/language/latency metadata.
- Stable event IDs deduplicate retries; response corrections update the original row. The normal browser chat history also keeps visible voice messages.
- `DELETE /api/voice/history` deletes the verified caller's voice history and ends their active sessions. It does not delete browser-local chat history or provider-held records.
- Recordings are not a training dataset and are not reused for training automatically.
- Use one backend worker/replica for this implementation's process-local active-session and rate controls. Before scaling, replace those controls with a shared atomic store; SQLite text history alone is insufficient for distributed session coordination.
- If a reverse proxy hides client addresses, direct-IP limits may apply to the whole proxy. Keep owner limits and configure a trusted edge limiter; do not blindly trust client `X-Forwarded-For` headers.
- Mount a private persistent disk for SQLite on hosted deployments. Without it, voice history is lost on redeploy. Restrict OS access and keep backups private.
- Disconnect/close/logout stop SDK audio and attempt backend revocation. Unexpected crashes/refreshes rely on expiry; reconnection may require waiting for an unrevoked reservation to expire.
- Output-volume disabling stops local playback volume; it does not avoid provider synthesis charges. Speech-rate controls are deliberately omitted until supported/verified.
- Latency shown in settings measures utterance/VAD-to-SDK-speaking-event, an approximation of first audio. No latency number has been measured with a real provider in this pass.

## Acceptance checklist

Automated offline tests cover auth rejection, anonymous restrictions, allowed origins, owner isolation, stale document revisions, rate/payload limits, expiry, SSE completion/error/cancellation, language tool formatting, uncertain-language clarification, duplicate events and preference/transport lifecycle. These tests mock identity/model/provider calls; they do not verify acoustic quality.

All live cases are **pending**:

| Area | Required live cases |
| --- | --- |
| English | Introduce yourself; explain React; explain REST API. |
| Hindi | अपना परिचय दो; React/Next.js difference; Node.js आसान भाषा में समझाओ. |
| Nepali | आफ्नो परिचय देऊ; REST API बुझाइदेऊ; नेपालको राजधानी कहाँ हो. |
| Mixed language | Hinglish, Nepali/English terminology, Romanized Nepali, similar Hindi/Nepali expressions. |
| Switching | English → Hindi → Nepali → English, manual and explicit spoken switching; Auto only on its verified agent. |
| Audio | Denied/unavailable mic, mute/unmute, volume zero, interruption, rapid close/reopen, token expiry, network loss/retry, refresh and multiple tabs. |
| Regression | Text stream/edit, attachments/recruiter fit, RAG, history, admin login/logout and portfolio windows. |

For each verified language, record browser/device, agent/model/voice IDs, native-speaker pronunciation review, ASR transcription accuracy, context continuity and observed first-audio latency. Do not enable `VOICE_VERIFIED_NE` based solely on passing text tests.

### Recorded local verification — 19 October 2026

- Frontend Node tests: **46 passed**.
- Backend unittest suite: **51 passed**, including English/Hindi/Nepali manual-language routing with synthetic model output. These are protocol checks, not speech recognition tests.
- TypeScript check and final Next.js production build: passed; all existing routes generated.
- Targeted ESLint check for the new transport/settings files and updated orb component: passed. This is not a claim that the whole repository has no pre-existing lint issues.
- Browser UI: verified opening/closing the voice window, disabled English/हिन्दी/नेपाली/Auto choices before API configuration, setup-pending status, settings disclosure, output-volume/subtitle controls and microphone status “Not requested.” Existing emerald orb/macOS controls remain visible.
- No microphone permission was granted, no audio was captured and no live voice session was started. First-audio latency, real interruption, speech accuracy, provider/account support and native pronunciation are unmeasured.

## Deployment later

No code has been pushed or deployed as part of this pass. When ready, deploy the FastAPI code first with voice disabled, set its private environment values/persistent disk and configure the public custom LLM URL. Build/deploy the frontend with the matching API URL and existing Supabase public settings. Run the live checklist on a restricted account, then enable verified language flags and voice access.

Official references checked during implementation:

- [React SDK](https://elevenlabs.io/docs/eleven-agents/libraries/react) and installed SDK 1.18.0 type definitions.
- [WebRTC conversation tokens](https://elevenlabs.io/docs/api-reference/conversations/get-webrtc-token).
- [Custom LLM streaming and extra body](https://elevenlabs.io/docs/eleven-agents/customization/llm/custom-llm).
- [Language detection system tool](https://elevenlabs.io/docs/eleven-agents/customization/tools/system-tools/language-detection).
- [TTS models](https://elevenlabs.io/docs/overview/models/) and [speech recognition](https://elevenlabs.io/docs/overview/capabilities/speech-to-text/).
- [Supabase identity verification](https://supabase.com/docs/reference/javascript/auth-getuser) and [anonymous sign-ins](https://supabase.com/docs/guides/auth/auth-anonymous).
