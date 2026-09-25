# @vdaluz/astro-inapp-escape

[![npm version](https://img.shields.io/npm/v/@vdaluz/astro-inapp-escape.svg)](https://www.npmjs.com/package/@vdaluz/astro-inapp-escape)
[![CI](https://github.com/vdaluz/astro-inapp-escape/actions/workflows/ci.yml/badge.svg)](https://github.com/vdaluz/astro-inapp-escape/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@vdaluz/astro-inapp-escape.svg)](LICENSE)

Some platforms refuse to let their own affiliate links render inside another app's in-app browser at all - Amazon's Associates program is explicit about this: links have to open in the system browser or the Amazon app, not a webview embedded inside Instagram, TikTok, or similar. `@vdaluz/astro-inapp-escape` detects when a visitor is inside one of those in-app browsers and helps them reach the system browser: an automatic redirect on Android, an instructional interstitial on iOS (there's no reliable automated escape there - see [Platform support](#platform-support)). Ships raw `.astro` and `.ts` - the consuming app's Astro/Vite compiles them (no prebuild step).

## Install

```
npm install @vdaluz/astro-inapp-escape
```

Peer dependency: `astro` >= 6. Runtime dependency: [`inapp-spy`](https://github.com/shalanah/inapp-spy) - a maintained, TypeScript-typed in-app-browser detection library, rather than hand-rolled user-agent regex.

## Usage

Drop `<InAppEscape />` once, anywhere it'll render on every page you want protected - a shared layout is the usual spot:

```astro
---
import InAppEscape from '@vdaluz/astro-inapp-escape/InAppEscape.astro';
---

<InAppEscape />
```

On load, it detects whether the current visitor is inside a known in-app browser (Facebook, Instagram, TikTok, Twitter, WeChat, Telegram, Messenger, LinkedIn, Snapchat, Threads, Line, WhatsApp, Reddit, Google Search App):

- **Android:** immediately redirects via a packageless `intent://` link, which hands the page to whatever the device's actual default browser is (never assumes Chrome - pinning a specific browser package breaks devices whose default is Samsung Internet, Firefox, or anything else).
- **iOS:** renders a small interstitial banner instructing the visitor to tap "•••" (or the Safari icon) and choose "Open in Safari." No automated iOS escape is attempted - see [Platform support](#platform-support) for why.
- **Everywhere else** (regular browser, desktop, unrecognized in-app browser): renders nothing.

Override the interstitial copy or its default classes. The component controls visibility itself through the `hidden` attribute, so a custom `class` only needs styling, never `hidden` or a display rule:

```astro
<InAppEscape message="Tap the ••• menu above and choose Open in Safari to continue." class="my-banner" />
```

## Lower-level API

For anything more custom than the drop-in component - gating a single CTA instead of the whole page, logging an analytics event before redirecting, etc:

```ts
import { detectInApp, detectPlatform, buildAndroidIntentUrl } from '@vdaluz/astro-inapp-escape';

const { isInApp, appKey, appName } = detectInApp(); // client-side: omit the ua arg for best accuracy
if (isInApp) {
  const platform = detectPlatform(navigator.userAgent);
  if (platform === 'android') {
    window.location.href = buildAndroidIntentUrl(window.location.href);
  }
  // platform === 'ios': show your own instructional UI - see InAppEscape.astro for the pattern.
}
```

`detectInApp` also accepts a UA string for server-side detection (SSR, middleware): `detectInApp(request.headers.get('user-agent'))`.

## Platform support

| Platform | Mechanism | Reliability |
|---|---|---|
| Android | Auto-redirect via a packageless `intent://…#Intent;scheme=https;end` link | Reliable - a documented Android URI scheme, not a fragile trick |
| iOS | Instructional interstitial ("tap ••• to open in Safari") | No automated alternative exists |

There's no standard web API for a page to force itself out of an iOS in-app browser. The relevant proposal, [WICG/proposals#173](https://github.com/WICG/proposals/issues/173), is still open with no resolution. Documented automated workarounds exist but are fragile and break on OS updates without warning - this package deliberately doesn't attempt one, on the theory that a bad UX guess is worse than an honest instruction.

## Per-app glue

This is a component library, not a drop-in escape mechanism. Each consuming app is responsible for:

- Placing `<InAppEscape />` somewhere it renders on every page that needs protection (typically a shared layout).
- Token CSS variables referenced by the default interstitial styling: `accent-soft`, `fg`, `border`. See [`@vdaluz/astro-blog`'s `tokens.example.css`](https://github.com/vdaluz/astro-blog) for the full token set these sites already share.

## Contributing

Issues welcome. PRs by discussion - open an issue first for anything beyond a typo or docs fix.

### Releasing

Maintainer-only. Releases are tag-triggered and published to npm via GitHub Actions (Trusted
Publishing / OIDC, no token secret):

1. Test before tagging: `npm pack`, install the tarball into a scratch Astro app (or a consumer
   locally), `astro check && astro build`.
2. Bump the version with `npm version X.Y.Z --no-git-tag-version`, which updates `package.json`
   and `package-lock.json` together, then commit both.
3. Tag `vX.Y.Z` and push the tag. Pushing the tag runs `.github/workflows/publish.yml`, which
   type-checks, tests, verifies the tag matches `package.json`'s version, and only then runs
   `npm publish`.
4. Confirm the version is live: `npm view @vdaluz/astro-inapp-escape version`. Consumers bump
   their own semver pin once it's confirmed live - see this package's CHANGELOG.md for what
   changed.

## Consumers

- [wq1k.com](https://wq1k.com)
- [vdaluz.com](https://vdaluz.com)
- [freetoolbox.net](https://freetoolbox.net)
- [imperfectsystems.com](https://imperfectsystems.com)
- [vicstradamus.com](https://vicstradamus.com)
- [deepcutatlas.com](https://deepcutatlas.com)
- [roomforstars.com](https://roomforstars.com)

## License

MIT
