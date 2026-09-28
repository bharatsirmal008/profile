"use client";

import { useEffect, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";

const USER = "bharatsirmal008";
type Profile = { login: string; name: string | null; avatar_url: string; bio: string | null; location: string | null; followers: number; following: number; public_repos: number; created_at: string };
type Repository = { id: number; name: string; description: string | null; language: string | null; stargazers_count: number; forks_count: number; topics: string[]; updated_at: string; fork: boolean; archived: boolean; default_branch: string };
type Activity = { id: string; type: string; created_at: string; repo: { name: string } };
type Overview = { profile: Profile; repos: Repository[] };
const cache = new Map<string, { expires: number; promise: Promise<unknown> }>();

async function github<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com/${path}`, { headers: { Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    if (response.status === 403 || response.status === 429) throw new Error("GitHub’s public API limit has been reached. Please try again later.");
    if (response.status === 404) throw new Error("This public content is not available on GitHub.");
    throw new Error(`GitHub is unavailable right now (${response.status}). Please try again.`);
  }
  return response.json() as Promise<T>;
}

async function repositories() {
  const result: Repository[] = [];
  for (let page = 1; ; page++) {
    const batch = await github<Repository[]>(`users/${USER}/repos?sort=updated&per_page=100&page=${page}`);
    result.push(...batch);
    if (batch.length < 100) return result;
  }
}

function cached<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const previous = cache.get(key);
  if (previous && previous.expires > Date.now()) return previous.promise as Promise<T>;
  const promise = loader().catch((error) => { cache.delete(key); throw error; });
  cache.set(key, { expires: Date.now() + 300000, promise });
  return promise;
}

function useResource<T>(key: string, loader: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; data?: T; error?: string }>();
  useEffect(() => {
    let current = true;
    cached(key, loader).then((data) => { if (current) setResult({ key, attempt, data }); }, (error: unknown) => {
      if (current) setResult({ key, attempt, error: error instanceof Error ? error.message : "Could not load GitHub data. Check your connection and try again." });
    });
    return () => { current = false; };
  }, [key, loader, attempt]);
  return { ...(result?.key === key && result.attempt === attempt ? result : {}), retry: () => { cache.delete(key); setAttempt((n) => n + 1); } };
}

const loadOverview = async (): Promise<Overview> => {
  const [profile, repos] = await Promise.all([github<Profile>(`users/${USER}`), repositories()]);
  return { profile, repos };
};
const loadActivity = () => github<Activity[]>(`users/${USER}/events/public?per_page=30`);
const date = (value: string) => new Date(value).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });

function Status({ error, retry }: { error?: string; retry: () => void }) {
  return <div role="status" className="rounded-xl border border-slate-700 p-6 text-sm text-slate-300">{error || "Loading public GitHub data…"}{error && <button onClick={retry} className="ml-3 rounded border border-slate-600 px-3 py-1 hover:bg-slate-800">Retry</button>}</div>;
}
function Stats({ repo }: { repo: Repository }) {
  return <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400"><span>● {repo.language || "Not specified"}</span><span>☆ {repo.stargazers_count} stars</span><span>⑂ {repo.forks_count} forks</span><span>Updated {date(repo.updated_at)}</span></div>;
}
function Topics({ repo }: { repo: Repository }) {
  return <div className="flex flex-wrap gap-1.5">{(repo.topics || []).map((topic) => <span key={topic} className="rounded-full bg-blue-950 px-2.5 py-1 text-[11px] text-blue-300">{topic}</span>)}</div>;
}
function RepoCard({ repo, select }: { repo: Repository; select: (repo: Repository) => void }) {
  return <button onClick={() => select(repo)} className="flex h-full w-full flex-col gap-3 rounded-xl border border-slate-700 bg-[#161b22] p-4 text-left transition-colors hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400"><span className="flex w-full flex-wrap items-center gap-2"><span className="break-all font-semibold text-blue-400">{repo.name}</span><span className="rounded-full border border-slate-600 px-2 text-[10px] text-slate-400">{repo.archived ? "Archived" : repo.fork ? "Fork" : "Public"}</span></span><span className="flex-1 text-sm text-slate-300">{repo.description || "No description provided."}</span><Topics repo={repo} /><Stats repo={repo} /></button>;
}
function RepoGrid({ repos, select }: { repos: Repository[]; select: (repo: Repository) => void }) {
  return repos.length ? <div className="grid gap-3 @[640px]:grid-cols-2">{repos.map((repo) => <RepoCard key={repo.id} repo={repo} select={select} />)}</div> : <p className="py-4 text-sm text-slate-400">No repositories to show.</p>;
}

function Readme({ name }: { name: string }) {
  const [loader] = useState(() => async () => {
    const response = await fetch(`https://api.github.com/repos/${USER}/${encodeURIComponent(name)}/readme`, { headers: { Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(15000) });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(response.status === 403 || response.status === 429 ? "GitHub’s public API limit has been reached. Try again later." : "Unable to load the README. Please try again.");
    const file = await response.json() as { content?: string; encoding: string };
    if (!file.content || file.encoding !== "base64") return null;
    return new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\s/g, "")), (character) => character.charCodeAt(0)));
  });
  const { data, error, retry } = useResource(`readme:${name}`, loader);
  if (error || data === undefined) return <Status error={error} retry={retry} />;
  if (data === null) return <p className="text-sm text-slate-400">No README preview is available for this repository.</p>;
  return <div className="space-y-4 break-words text-sm leading-7 text-slate-300 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:font-semibold [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/40 [&_pre]:p-4 [&_code]:text-xs [&_ul]:list-inside [&_ul]:list-disc [&_ol]:list-inside [&_ol]:list-decimal"><ReactMarkdown skipHtml components={{ a: ({ children }) => <span className="text-blue-300">{children}</span>, img: ({ alt }) => <span className="text-xs text-slate-500">{alt ? `[${alt}]` : ""}</span> }}>{data}</ReactMarkdown></div>;
}
function RepoDetail({ repo, back }: { repo: Repository; back: () => void }) {
  return <div className="space-y-5"><button onClick={back} className="text-sm text-blue-400 hover:underline">← Back to repositories</button><div className="rounded-xl border border-slate-700 p-5"><h2 className="break-all text-xl font-semibold">{repo.name}</h2><p className="my-3 text-sm text-slate-300">{repo.description || "No description provided."}</p><Stats repo={repo} /><div className="my-4"><Topics repo={repo} /></div><a href={`https://github.com/${USER}/${encodeURIComponent(repo.name)}`} target="_blank" rel="noopener noreferrer" className="inline-block rounded-md border border-slate-600 bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">Open on GitHub ↗</a></div><section className="rounded-xl border border-slate-700 p-5"><h3 className="mb-5 border-b border-slate-700 pb-3 font-semibold">README</h3><Readme key={repo.name} name={repo.name} /></section></div>;
}
function ActivityList({ repos, select }: { repos: Repository[]; select: (repo: Repository) => void }) {
  const { data, error, retry } = useResource("activity", loadActivity);
  if (!data) return <Status error={error} retry={retry} />;
  if (!data.length) return <p className="text-sm text-slate-400">No recent public activity is available.</p>;
  return <div className="space-y-3">{data.map((event) => {
    const repo = repos.find((item) => `${USER}/${item.name}`.toLowerCase() === event.repo.name.toLowerCase());
    return <article key={event.id} className="rounded-lg border border-slate-700 p-4 text-sm"><p className="font-medium">{event.type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2")}</p>{repo ? <button onClick={() => select(repo)} className="my-1 break-all text-blue-400 hover:underline">{event.repo.name}</button> : <p className="my-1 break-all text-slate-300">{event.repo.name}</p>}<p className="text-xs text-slate-500">{date(event.created_at)}</p></article>;
  })}</div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3"><h3 className="font-semibold">{title}</h3>{children}</section>;
}

export function GitHubApp() {
  const { data, error, retry } = useResource("overview", loadOverview);
  const [tab, setTab] = useState("Overview");
  const [selected, setSelected] = useState<Repository | null>(null);
  const [query, setQuery] = useState("");
  const repos = data?.repos || [];
  const languages = repos.reduce<Record<string, number>>((result, repo) => { if (repo.language) result[repo.language] = (result[repo.language] || 0) + 1; return result; }, {});
  const stars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
  const forks = repos.reduce((total, repo) => total + repo.forks_count, 0);
  return (
    <div className="@container min-h-full bg-[#0d1117] p-4 text-slate-100 sm:p-6">
      {!data ? <Status error={error} retry={retry} /> : <>
        <div className="mb-6 flex flex-wrap gap-5"><img src={data.profile.avatar_url} alt={`${data.profile.login} avatar`} className="h-24 w-24 rounded-full border border-slate-700" /><div className="min-w-0 flex-1"><h2 className="text-2xl font-semibold">{data.profile.name || "Bharat Sirmal"}</h2><p className="text-slate-400">@{data.profile.login}</p><p className="mt-2 text-sm text-slate-300">{data.profile.bio || "No public bio provided."}</p>{data.profile.location && <p className="mt-2 text-xs text-slate-400">{data.profile.location}</p>}<p className="mt-3 text-xs text-slate-400">{data.profile.followers} followers · {data.profile.following} following · {data.profile.public_repos} public repositories</p></div></div>
        <nav role="tablist" aria-label="GitHub sections" className="mb-5 flex gap-4 border-b border-slate-700">{["Overview", "Repositories", "Activity"].map((name) => <button key={name} id={`github-tab-${name}`} role="tab" aria-controls="github-panel" aria-selected={tab === name} onClick={() => { setTab(name); setSelected(null); }} className={`border-b-2 px-1 py-3 text-sm ${tab === name ? "border-orange-400 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>{name}</button>)}</nav>
        <div id="github-panel" role="tabpanel" aria-labelledby={`github-tab-${tab}`}>
          {selected ? <RepoDetail repo={selected} back={() => { setSelected(null); setTab("Repositories"); }} /> : tab === "Overview" ? <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">{[["Repositories", data.profile.public_repos], ["Stars", stars], ["Forks", forks]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-700 p-3"><p className="text-2xl font-semibold">{value}</p><p className="text-xs text-slate-400">{label}</p></div>)}</div>
            <Section title="Featured repositories"><p className="text-xs text-slate-500">Top original repositories by stars and recent updates.</p><RepoGrid repos={[...repos].filter((repo) => !repo.fork).sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 4)} select={setSelected} /></Section>
            <Section title="Recently updated"><RepoGrid repos={repos.slice(0, 4)} select={setSelected} /></Section>
            <Section title="Main programming languages"><div className="flex flex-wrap gap-2">{Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([language, count]) => <span key={language} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{language} · {count} {count === 1 ? "repository" : "repositories"}</span>)}{!Object.keys(languages).length && <p className="text-sm text-slate-400">No language statistics available.</p>}</div></Section><p className="text-xs text-slate-500">Joined {date(data.profile.created_at)} · Public GitHub data · Cached for 5 minutes</p>
          </div> : tab === "Repositories" ? <div className="space-y-4"><input aria-label="Search repositories" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a repository…" className="w-full rounded-lg border border-slate-700 bg-[#161b22] px-4 py-2 text-sm outline-blue-400" /><RepoGrid repos={repos.filter((repo) => `${repo.name} ${repo.description || ""} ${repo.language || ""}`.toLowerCase().includes(query.toLowerCase()))} select={setSelected} /></div> : <ActivityList repos={repos} select={setSelected} />}
        </div>
      </>}
    </div>
  );
}
