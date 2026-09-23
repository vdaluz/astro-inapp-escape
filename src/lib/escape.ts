import { detectPlatform } from './detect.ts';

/**
 * Builds an Android intent:// link that reopens `url` in the device's default
 * browser. Deliberately omits `package=` - pinning a specific browser (e.g.
 * Chrome) breaks devices whose default is a different browser (Samsung
 * Internet, Firefox, etc). See WICG/proposals#173 for why there's still no
 * standard web API for this.
 */
export function buildAndroidIntentUrl(url: string): string {
  const parsed = new URL(url);
  const scheme = parsed.protocol.replace(':', '');
  return `intent://${parsed.host}${parsed.pathname}${parsed.search}#Intent;scheme=${scheme};end`;
}

export type EscapeAction = 'redirect' | 'banner' | 'none';

export function decideEscape(isInApp: boolean, ua: string): EscapeAction {
  if (!isInApp) return 'none';
  const platform = detectPlatform(ua);
  if (platform === 'android') return 'redirect';
  if (platform === 'ios') return 'banner';
  return 'none';
}
