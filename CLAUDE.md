# CLAUDE.md

## What this repo is

`@vdaluz/astro-inapp-escape`: in-app-browser (Instagram, TikTok, Facebook, etc) detection and escape for vdaluz.com-family sites. Detects when a page is loaded inside a social app's own webview and helps the visitor reach the system browser instead - some platforms (Amazon Associates among them) prohibit their affiliate links from rendering inside another app's in-app browser at all. Consumed by all five family sites as an npm-registry semver pin; tracked in Plane under the AST project.

## Commands

```bash
npm run check   # astro check (typecheck)
npm test        # node --test
```

## Workflow

Shared preamble: `.claude/rules/git-workflow-direct-to-main.md`.

## Plane (AST project)

Project ID, state UUIDs, and label UUIDs: **`.claude/plane.yml`**.

## Conventions

Shared `@vdaluz/astro-*` conventions (raw source/no build step, per-path exports, `.ts` extensions on relative imports):
`.claude/rules/astro-package-conventions.md`.

- **One runtime dependency: `inapp-spy`.** Unlike astro-blog/astro-affiliate's dependency-free convention, this package legitimately needs a maintained in-app-browser UA-detection library rather than hand-rolled regex. Don't add further runtime dependencies without deciding that's worth it - the family default is still dependency-free.
- **No `package=` pin on the Android intent link.** `buildAndroidIntentUrl` deliberately omits `package=com.android.chrome` from the generated `intent://` URL so it opens the device's actual default browser, not a hardcoded Chrome assumption - pinning Chrome breaks devices whose default is Samsung Internet or another browser.
- **iOS has no automated escape.** The WICG proposal for a native in-app-browser exit API ([WICG/proposals#173](https://github.com/WICG/proposals/issues/173)) is still open and unresolved as of this package's creation. `InAppEscape.astro` renders an instructional interstitial on iOS ("tap ••• to open in Safari") rather than attempting a fragile automated bypass.
- **Token-driven default styling.** The interstitial references the shared token custom properties (see [`@vdaluz/astro-blog`'s `tokens.example.css`](https://github.com/vdaluz/astro-blog) for the full set the family sites share). Never hardcode a site's palette; consumers can always override via the `class` prop.

## Release process

Same tag-then-npm-publish process shared by all `@vdaluz/*` component libraries, consumed via
npm-registry semver pins (not tarball URLs). See the README's "Releasing" section for the
concrete steps.

## Consumers

- wq1k.com
- freetoolbox.net
- imperfectsystems.com
- vdaluz.com (`src/layouts/Layout.astro`)
- vicstradamus.com (`src/layouts/Layout.astro`)
