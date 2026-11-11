# KHM Tutoring SEO/GEO Audit

Audited November 10, 2026 (Hawaii time). Production: https://www.khmtutoring.com. Method: live HTTP crawl of the XML sitemap and linked pages, inspection of rendered metadata and JSON-LD, and source review using the [B12Labs SEO audit skill](https://github.com/B12Labs/skills/blob/main/skills/agentic-seo/SKILL.md) as a checklist. This is a technical and content consistency audit, not a ranking or traffic report.

## Result

The site's crawl foundation is healthy. All 15 sitemap URLs returned HTTP 200. Each had a title, meta description, self-referencing canonical, exactly one H1, and no `noindex` directive. The 15 distinct internal paths found in rendered links returned successful responses. `robots.txt`, `sitemap.xml`, `llms.txt`, the favicon, and the Open Graph image all returned HTTP 200.

The homepage publishes valid JSON-LD for the business, website, and tutoring service. The educators page publishes business and tutor `Person` data. The location page now publishes business and breadcrumb data. These checks establish that the structured data is present and parseable; they do not guarantee search engine rich results.

The public site has clear Honolulu, Kakaʻako, Oʻahu, and statewide online tutoring descriptions. The sitemap includes dedicated pages for seven service topics, a location page, educators, contact, diagnostic, and group SAT prep. `robots.txt` allows major search crawlers and named AI search crawlers while excluding staff and API routes. `llms.txt` offers a structured summary and links for AI systems.

## Confirmed finding corrected

**GEO contact inconsistency, medium impact.** `llms.txt` listed `khmtutoring1@gmail.com` while the site's public contact address and business structured data use `info@khmtutoring.com`. The file also named the partner venue differently from the site. Both entries were aligned in this audit. This prevents AI readers of `llms.txt` from repeating outdated contact details.

## Items requiring evidence outside the website

- **Search performance:** Search Console and Bing Webmaster Tools were not available to this audit. Index coverage, impressions, clicks, queries, and crawl errors therefore remain unverified.
- **Local profile consistency:** The Google Business Profile and other directory listings were not available. Their address, service area, hours, and category need comparison with the website's business data.
- **Performance:** Google's PageSpeed API returned HTTP 429 during this audit. Core Web Vitals and mobile performance scores remain unmeasured; no score is inferred.
- **Public claims:** The site and `llms.txt` repeat 300+ students helped, +15% average score boost, and 5.0 parent rating. Source records for those claims were not available in the audit. Confirm their basis and refresh date before treating them as verified GEO facts.

## Limits

The internal link check covered rendered same-site paths from sitemap pages. It did not test form submissions, authenticated pages, external links, image visual quality, search ranking, or an authenticated tutor photo upload. Sitemap URLs and on-page metadata were inspected in production after commit `b0fedf9` deployed; the `llms.txt` correction is included in the next commit.
