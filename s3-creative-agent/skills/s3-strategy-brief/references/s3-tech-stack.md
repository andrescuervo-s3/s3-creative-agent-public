# S3 Technology Stack Reference

Internal reference for the S3 Creative Agent plugin. Used by strategy brief
(section 2.1.2 Technical Direction) and future skills that need platform context.

## Core Platform: Tresio

S3's proprietary web platform. Not WordPress, not a static site generator,
not an off-the-shelf CMS. Custom-built framework with its own component
architecture, rendering engine, navigation system, and CDN infrastructure.

Key indicators across all S3 sites:
- Tresio Tracking Script: tracking.tresio.co
- Tresio CDN: js.tresiocdn.com
- Tresio Nav System: tresio-nav__* (BEM convention)
- Tresio Config Object: window.tresioConfig

## Content Management: DatoCMS

Headless CMS. All content across S3 and client sites managed through DatoCMS.
Images served from www.datocms-assets.com. Provides structured content modeling
(content types, fields, taxonomies, relationships). Exposes content via GraphQL API,
which Tresio consumes to render pages.

## Video Infrastructure: Mux

Video hosting and streaming via Mux. Handles encoding, delivery, and thumbnail
generation. Tresio CDN layer (videos.tresiocdn.com) may proxy or cache video assets.

## Component Architecture

Consistent naming convention across all sites:

| Prefix | Purpose | Examples |
|--------|---------|----------|
| mod_* | Content modules (page-level content blocks) | mod_home_hero, mod_featured_slider, mod_hub |
| partial_* | Reusable UI fragments (shared across pages/sites) | partial_nav_header, partial_footer, partial_socials |
| tresio-* | Platform-level components (BEM-style) | tresio-nav__main, tresio-nav__link, tresio-ada-toggle |
| block | Generic content wrapper | General-purpose container class |

## Shared Components (Core Framework)

These appear identically across all S3 sites:
- partial_nav_header, partial_nav, partial_nav_item
- partial_footer
- partial_socials
- partial_a11y_menu, partial_a11y_disclaimer
- partial_cta_sub
- partial_breadcrumb
- tresio-nav__* (full BEM system)
- tresio-accessibility-menu

## Common Third-Party Integrations

| Service | Purpose |
|---------|---------|
| Google Tag Manager | Tag management and analytics orchestration |
| IconNode (scripts.iconnode.com) | Tracking / analytics layer |
| Adobe Typekit | Web font delivery |
| Cloudflare | CDN, security, performance analytics |
| Swiper.js | Touch-enabled carousel / slider library |

Note: Individual client sites may have additional integrations (Hotjar, Ahrefs,
Constant Contact, etc.) configured per engagement.

## Architecture Layers

1. **Content (DatoCMS)** -- Structured content models, tagging, media assets, GraphQL API
2. **Platform (Tresio)** -- Rendering engine, component framework, nav system, build/deploy pipeline
3. **Media (Mux + Tresio CDN)** -- Video encoding, streaming, thumbnails, asset caching
4. **Analytics & Integrations** -- GTM orchestration, proprietary tracking, per-client tools
