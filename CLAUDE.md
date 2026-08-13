# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this repo is

`@vdaluz/astro-inapp-escape`: in-app-browser (Instagram, TikTok, Facebook, etc) detection and escape for vdaluz.com-family sites. Detects when a page is loaded inside a social app's own webview and helps the visitor reach the system browser instead - some platforms (Amazon Associates among them) prohibit their affiliate links from rendering inside another app's in-app browser at all. Consumed by site repos as a pinned https-tarball dependency; tracked in Plane under the AST project.

## Commands

```bash
npm run check   # astro check (typecheck)
npm test        # node --test
```

## Workflow

**No worktrees.** Work directly on `main` - this repo is small, single-maintainer, and worked sequentially, per the standing rule for the sibling `@vdaluz/*` packages (astro-blog, astro-affiliate, astro-og-cards, astro-opt-in-analytics all follow this). Consumers only ever see tagged releases, so `main` is safe to iterate on.

## Conventions

- **Raw source, no build step.** Ships `.ts` and `.astro` from `src/`; the consuming app's Astro/Vite compiles them. Never add a build/dist step or `main` field.
- **Explicit `.ts` extensions on relative imports** (matches astro-og-cards/astro-affiliate) - required for `node --test` to resolve them directly without a bundler.
- **Per-path exports.** Components are exposed via the `exports` map in `package.json`. New public files need an exports entry.
- **One runtime dependency: `inapp-spy`.** Unlike astro-blog/astro-affiliate's dependency-free convention, this package legitimately needs a maintained in-app-browser UA-detection library rather than hand-rolled regex. Don't add further runtime dependencies without deciding that's worth it - the family default is still dependency-free.
- **No `package=` pin on the Android intent link.** `buildAndroidIntentUrl` deliberately omits `package=com.android.chrome` from the generated `intent://` URL so it opens the device's actual default browser, not a hardcoded Chrome assumption - pinning Chrome breaks devices whose default is Samsung Internet or another browser.
- **iOS has no automated escape.** The WICG proposal for a native in-app-browser exit API ([WICG/proposals#173](https://github.com/WICG/proposals/issues/173)) is still open and unresolved as of this package's creation. `InAppEscape.astro` renders an instructional interstitial on iOS ("tap ••• to open in Safari") rather than attempting a fragile automated bypass.
- **Token-driven default styling.** The interstitial references the shared token custom properties (see [`@vdaluz/astro-blog`'s `tokens.example.css`](https://github.com/vdaluz/astro-blog) for the full set the family sites share). Never hardcode a site's palette; consumers can always override via the `class` prop.

## Release process

Same tag-pinned-tarball process shared by all `@vdaluz/*` component libraries - see root
`~/Repos/CLAUDE.md` -> "Astro shared-library release process".

## Consumers

Tracked as per-site issues, each blocked on this package's first publish: WQ1K-165 (wq1k.com), VDA-1188 (vdaluz.com), FTB-59 (freetoolbox.net), IPS-530 (imperfectsystems.com), VIC-42 (vicstradamus.com).
