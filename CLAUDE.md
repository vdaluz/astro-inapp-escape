# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this repo is

`@vdaluz/astro-inapp-escape`: in-app-browser (Instagram, TikTok, Facebook, etc) detection and escape for vdaluz.com-family sites. Detects when a page is loaded inside a social app's own webview and helps the visitor reach the system browser instead - some platforms (Amazon Associates among them) prohibit their affiliate links from rendering inside another app's in-app browser at all. Consumed by site repos as an npm-registry semver pin (live on wq1k.com, freetoolbox.net, imperfectsystems.com; pending on vdaluz.com, vicstradamus.com); tracked in Plane under the AST project.

## Commands

```bash
npm run check   # astro check (typecheck)
npm test        # node --test
```

## Workflow

Shared preamble: `.claude/rules/git-workflow-direct-to-main.md`.

## Conventions

Shared `@vdaluz/astro-*` conventions (raw source/no build step, per-path exports):
`.claude/rules/astro-package-conventions.md`.

- **Explicit `.ts` extensions on relative imports** (matches astro-og-cards/astro-affiliate) - required for `node --test` to resolve them directly without a bundler.
- **One runtime dependency: `inapp-spy`.** Unlike astro-blog/astro-affiliate's dependency-free convention, this package legitimately needs a maintained in-app-browser UA-detection library rather than hand-rolled regex. Don't add further runtime dependencies without deciding that's worth it - the family default is still dependency-free.
- **No `package=` pin on the Android intent link.** `buildAndroidIntentUrl` deliberately omits `package=com.android.chrome` from the generated `intent://` URL so it opens the device's actual default browser, not a hardcoded Chrome assumption - pinning Chrome breaks devices whose default is Samsung Internet or another browser.
- **iOS has no automated escape.** The WICG proposal for a native in-app-browser exit API ([WICG/proposals#173](https://github.com/WICG/proposals/issues/173)) is still open and unresolved as of this package's creation. `InAppEscape.astro` renders an instructional interstitial on iOS ("tap ••• to open in Safari") rather than attempting a fragile automated bypass.
- **Token-driven default styling.** The interstitial references the shared token custom properties (see [`@vdaluz/astro-blog`'s `tokens.example.css`](https://github.com/vdaluz/astro-blog) for the full set the family sites share). Never hardcode a site's palette; consumers can always override via the `class` prop.

## Release process

Same tag-then-npm-publish process shared by all `@vdaluz/*` component libraries, consumed via
npm-registry semver pins (not tarball URLs, since META-90) - see root `~/Repos/CLAUDE.md` ->
"Astro shared-library release process".

## Consumers

Live: wq1k.com (WQ1K-165), freetoolbox.net (FTB-59), imperfectsystems.com (IPS-530) - all
confirmed pinned to `^0.1.0` as of META-90. Still pending, tracked as per-site issues blocked on
adoption rather than on this package's first publish (that already happened): VDA-1188
(vdaluz.com), VIC-42 (vicstradamus.com).
