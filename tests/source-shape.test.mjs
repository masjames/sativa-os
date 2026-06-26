import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('worker exposes Sativa OS tool endpoints with auth skipped for test mode', () => {
  const source = readFileSync(new URL('../src/worker.ts', import.meta.url), 'utf8');
  for (const endpoint of ['/health', '/mcp', '/api/daily-brief', '/api/priority', '/api/capture', '/api/journal', '/api/decision']) {
    assert.match(source, new RegExp(endpoint.replaceAll('/', '\\/')));
  }
  assert.match(source, /auth: 'disabled-for-test'/);
});

test('migration includes core sections and system events', () => {
  const sql = readFileSync(new URL('../migrations/0001_initial.sql', import.meta.url), 'utf8');
  for (const section of ['entities', 'ledger', 'ventures', 'obligations', 'decisions', 'weekly', 'intentions', 'worries', 'journal', 'captures']) {
    assert.match(sql, new RegExp(section));
  }
  assert.match(sql, /CREATE TABLE IF NOT EXISTS system_events/);
});
