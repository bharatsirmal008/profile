import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, dependencies, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => { if (!(name in dependencies)) throw Error(`Unexpected import ${name}`); return dependencies[name]; }, Blob, ...globals }, { filename: file });
  return exports;
}
function fixture({ failSave = false, denied = false, oldPath = 'old-file' } = {}) {
  const calls = [];
  const client = { from() { return { select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: { data: { imagePath: oldPath, filePath: oldPath } } }; } }; } };
  const api = load('src/lib/portfolio-storage.ts', {
    './certificate-storage': {}, './local-projects': {},
    './supabase': { cloudEnabled: true, getSupabase: () => client },
    './cloud-content': {
      async requireAdmin() { if (denied) throw Error('denied'); },
      async uploadFile(kind, id, file) { calls.push(['upload', kind, id, file.type]); return 'new-file'; },
      async saveCloud(...args) { if (failSave) throw Error('save failed'); calls.push(['save', ...args]); },
      async discardFile(path) { calls.push(['discard', path]); },
      async deleteCloud(...args) { calls.push(['delete', ...args]); },
    },
  }, { fetch: async () => ({ blob: async () => new Blob(['image'], { type: 'image/png' }) }) });
  return { api, calls };
}
test('editing a project keeps the object path and never persists a temporary signed URL', async () => {
  const { api, calls } = fixture();
  await api.savePortfolioProject({ slug: 'p', imagePath: 'old-file', image: 'https://signed.example/token', isPrivate: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][3].imagePath, 'old-file');
  assert.equal(calls[0][3].image, '');
  assert.equal(calls[0][4], true);
});
test('removing a project image saves the empty attachment before deleting the object', async () => {
  const { api, calls } = fixture();
  await api.savePortfolioProject({ slug: 'p', image: '' });
  assert.equal(calls[0][0], 'save');
  assert.equal(calls[0][3].imagePath, null);
  assert.equal(calls[1][0], 'discard');
  assert.equal(calls[1][1], 'old-file');
});
test('project replacement uploads, saves, then cleans up the previous file', async () => {
  const { api, calls } = fixture();
  await api.savePortfolioProject({ slug: 'p', image: 'data:image/png;base64,AA==' });
  assert.deepEqual(calls.map(call => call[0]), ['upload', 'save', 'discard']);
  assert.equal(calls[1][3].imagePath, 'new-file');
});
test('certificate uploads store file metadata, not a Blob in database JSON', async () => {
  const { api, calls } = fixture();
  await api.savePortfolioCertificate({ id: 'c', file: new Blob(['pdf'], { type: 'application/pdf' }), filename: 'test.pdf', isPrivate: true });
  const row = calls.find(call => call[0] === 'save');
  assert.equal(row[3].filePath, 'new-file');
  assert.equal(row[3].fileType, 'application/pdf');
  assert.equal(row[3].filename, 'test.pdf');
  assert.equal('file' in row[3], false);
  assert.equal(row[4], true);
});
test('certificate file removal preserves the entry and clears its object reference', async () => {
  const { api, calls } = fixture();
  await api.savePortfolioCertificate({ id: 'c', title: 'Keep this certificate' });
  assert.equal(calls[0][3].title, 'Keep this certificate');
  assert.equal(calls[0][3].filePath, null);
  assert.deepEqual(calls.map(call => call[0]), ['save', 'discard']);
});
test('failed replacement cleans the new upload and leaves the original file intact', async () => {
  const { api, calls } = fixture({ failSave: true });
  await assert.rejects(api.savePortfolioCertificate({ id: 'c', file: new Blob(['pdf'], { type: 'application/pdf' }) }), /save failed/);
  assert.deepEqual(calls.map(call => [call[0], call[1]]), [['upload', 'certificate'], ['discard', 'new-file']]);
});
test('non-admin saves and deletes cannot reach storage or content mutations', async () => {
  const { api, calls } = fixture({ denied: true });
  await assert.rejects(api.savePortfolioProject({ slug: 'p', image: '' }), /denied/);
  await assert.rejects(api.removePortfolioCertificate('c'), /denied/);
  assert.equal(calls.length, 0);
});
test('entry deletion happens before object cleanup', async () => {
  const { api, calls } = fixture();
  await api.removePortfolioProject('p');
  assert.deepEqual(calls.map(call => call[0]), ['delete', 'discard']);
});
test('public listing explicitly filters private/deleted rows even for a logged-in admin', async () => {
  const filters = [];
  const query = { select() { return this; }, eq(key, value) { filters.push([key, value]); return this; }, order() { return this; }, then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve); } };
  const cloud = load('src/lib/cloud-content.ts', { react: {}, './supabase': { getSupabase: () => ({ from: () => query }) } });
  await cloud.listCloud('certificate');
  assert.deepEqual(filters, [['kind', 'certificate'], ['is_deleted', false], ['is_private', false]]);
});
