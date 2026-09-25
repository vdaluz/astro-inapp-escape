import InAppSpy from 'inapp-spy';

export type InAppDetection = ReturnType<typeof InAppSpy>;

export type Platform = 'android' | 'ios' | 'other';

export function detectInApp(ua?: string | null): InAppDetection {
  return InAppSpy(ua ? { ua } : undefined);
}

export function detectPlatform(ua: string): Platform {
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  return 'other';
}
