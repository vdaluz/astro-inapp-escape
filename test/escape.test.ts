import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAndroidIntentUrl } from '../src/lib/escape.ts';

test('buildAndroidIntentUrl builds a packageless intent link', () => {
  assert.equal(
    buildAndroidIntentUrl('https://example.com/foo'),
    'intent://example.com/foo#Intent;scheme=https;end',
  );
});

test('buildAndroidIntentUrl never pins a package - default browser must handle it', () => {
  const intentUrl = buildAndroidIntentUrl('https://example.com/foo');
  assert.ok(!intentUrl.includes('package='), 'pinning a package breaks non-Chrome default browsers');
});

test('buildAndroidIntentUrl preserves the query string', () => {
  assert.equal(
    buildAndroidIntentUrl('https://example.com/deal?tag=vdaluz-20&ref=social'),
    'intent://example.com/deal?tag=vdaluz-20&ref=social#Intent;scheme=https;end',
  );
});

test('buildAndroidIntentUrl preserves a nested path', () => {
  assert.equal(
    buildAndroidIntentUrl('https://example.com/blog/2026/some-post/'),
    'intent://example.com/blog/2026/some-post/#Intent;scheme=https;end',
  );
});
