import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { fetchTools, verifyTools, expectedTools, preferredNames, aliases } from '../scripts/verify-mcp-manifest.mjs';

test('actual MCP tools/list returns complete unfiltered control-plane manifest with schemas', async (t) => {
  execFileSync('npm', ['run', 'build'], { stdio: 'pipe' });
  const port = 8799;
  const child = spawn('bash', ['-lc', `exec npx -y node@22 ./node_modules/.bin/wrangler dev --local --port ${port}`], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const stop = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} };
  t.after(stop);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('wrangler dev did not become ready')), 30000);
    const onData = (chunk) => { if (String(chunk).includes(`localhost:${port}`) || String(chunk).includes('Ready on')) { clearTimeout(timer); resolve(); } };
    child.stdout.on('data', onData); child.stderr.on('data', onData); child.once('exit', (code) => reject(new Error(`wrangler exited early: ${code}`)));
  });
  const tools = await fetchTools(`http://127.0.0.1:${port}/mcp`);
  stop();
  child.stdout.destroy();
  child.stderr.destroy();
  const result = verifyTools(tools);
  assert.equal(result.missingExpected.length, 0, `missing: ${result.missingExpected.join(', ')}`);
  assert.equal(result.missingEmptySchemas.length, 0, `empty schemas: ${result.missingEmptySchemas.join(', ')}`);
  assert.equal(result.schemaFieldFailures.length, 0, `schema failures: ${result.schemaFieldFailures.join(', ')}`);
  assert.ok(expectedTools.every((name) => result.names.includes(name)));
  assert.ok(preferredNames.every((name) => result.names.includes(name)));
  assert.ok(aliases.every((name) => result.names.includes(name)));
});
