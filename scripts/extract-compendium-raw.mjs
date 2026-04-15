import fs from 'node:fs';

const transcriptPath =
  'C:/Users/Daniel/.cursor/projects/c-Users-Daniel-Documents-GitHub-sanieldanders-github-io/agent-transcripts/dbb7dccb-e100-42a7-87dd-9f5f19a0cb1a/dbb7dccb-e100-42a7-87dd-9f5f19a0cb1a.jsonl';
const outPath = new URL('../_compendium-raw.txt', import.meta.url);

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
const line = lines[96];
const o = JSON.parse(line);
let t = o.message.content[0].text;
if (t.startsWith('<user_query>')) {
  t = t.replace(/^<user_query>\s*/i, '').replace(/<\/user_query>\s*$/i, '');
}
fs.writeFileSync(outPath, t, 'utf8');
console.log('written', t.length, '->', outPath.pathname);
