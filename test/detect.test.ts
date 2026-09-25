import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectInApp, detectPlatform } from '../src/lib/detect.ts';
import { decideEscape } from '../src/lib/escape.ts';

// Real UAs, verified against inapp-spy 5.0.10 directly before writing these assertions.
const INSTAGRAM_ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36 Instagram 195.0.0.31.123 Android (29/10; 420dpi; 1080x2129; samsung; SM-G960F; starqltesq; qcom; en_US; 308693018)';
const INSTAGRAM_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 195.0.0.31.123 (iPhone12,1; iOS 14_4; en_US; en-US; scale=2.00; 828x1792; 308693018)';
const CHROME_ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36';
const SAFARI_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1';

test('detectInApp identifies Instagram on Android', () => {
  const result = detectInApp(INSTAGRAM_ANDROID_UA);
  assert.equal(result.isInApp, true);
  assert.equal(result.appKey, 'instagram');
});

test('detectInApp identifies Instagram on iOS', () => {
  const result = detectInApp(INSTAGRAM_IOS_UA);
  assert.equal(result.isInApp, true);
  assert.equal(result.appKey, 'instagram');
});

test('detectInApp reports no in-app browser for regular Chrome', () => {
  assert.equal(detectInApp(CHROME_ANDROID_UA).isInApp, false);
});

test('detectInApp reports no in-app browser for regular Safari', () => {
  assert.equal(detectInApp(SAFARI_IOS_UA).isInApp, false);
});

test('detectInApp accepts a Headers.get result, as the README SSR example calls it', () => {
  const headers = new Headers({ 'user-agent': INSTAGRAM_ANDROID_UA });
  assert.equal(detectInApp(headers.get('user-agent')).appKey, 'instagram');
});

test('detectInApp treats a missing user-agent header (null) like no argument', () => {
  assert.deepEqual(detectInApp(null), detectInApp());
});

test('detectPlatform identifies Android', () => {
  assert.equal(detectPlatform(INSTAGRAM_ANDROID_UA), 'android');
});

test('detectPlatform identifies iOS from an iPhone UA', () => {
  assert.equal(detectPlatform(INSTAGRAM_IOS_UA), 'ios');
});

test('detectPlatform falls back to other for a desktop UA', () => {
  const desktopUa =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  assert.equal(detectPlatform(desktopUa), 'other');
});

const DESKTOP_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

test('decideEscape redirects an Android in-app browser', () => {
  assert.equal(decideEscape(detectInApp(INSTAGRAM_ANDROID_UA).isInApp, INSTAGRAM_ANDROID_UA), 'redirect');
});

test('decideEscape shows the banner in an iOS in-app browser', () => {
  assert.equal(decideEscape(detectInApp(INSTAGRAM_IOS_UA).isInApp, INSTAGRAM_IOS_UA), 'banner');
});

test('decideEscape does nothing in regular Chrome on Android or Safari on iOS', () => {
  assert.equal(decideEscape(detectInApp(CHROME_ANDROID_UA).isInApp, CHROME_ANDROID_UA), 'none');
  assert.equal(decideEscape(detectInApp(SAFARI_IOS_UA).isInApp, SAFARI_IOS_UA), 'none');
});

test('decideEscape does nothing for an in-app browser on a platform with no escape path', () => {
  assert.equal(decideEscape(true, DESKTOP_UA), 'none');
});
