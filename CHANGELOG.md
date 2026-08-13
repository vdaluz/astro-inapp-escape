# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.1.0] - 2026-08-13

### Added

- Initial release: `detectInApp`/`detectPlatform` (wraps `inapp-spy`) and `buildAndroidIntentUrl` in `src/lib`, plus the `InAppEscape.astro` component - Android in-app browsers auto-redirect via a packageless `intent://` link, iOS in-app browsers get an instructional interstitial (no reliable automated escape exists on iOS - see [WICG/proposals#173](https://github.com/WICG/proposals/issues/173)).
