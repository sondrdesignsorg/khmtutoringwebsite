# SEO Resolution Plan: SAT & Math First

**Prepared:** November 19, 2026 (Hawaii time)  
**Based on:** `SEO-KEYWORD-RESEARCH-REPORT.md`, current repository source, and the November 2026 live search snapshot.

## Objective

Grow qualified organic leads from families searching for **SAT tutoring/prep** and **math tutoring** in Honolulu and Hawaiʻi. Keep other services discoverable, but spend the first optimization and measurement cycle on those two primary clusters. Do not set traffic or ranking targets until Search Console and lead baselines are available.

## What the current evidence says

| Report item | Current status after source review | Resolution |
|---|---|---|
| Homepage result showed old Gmail address | Current code configuration and footer use `info@khmtutoring.com`; repo `llms.txt` also lists it. The old email remains in staff fallback/auth code, which is not customer-facing. A live indexed result may be stale or may reflect another public surface. | Crawl production homepage, contact, footer, metadata, schema, and `llms.txt`; search public pages/directories; fix only a live public occurrence. Then request URL recrawl in Search Console. |
| Inconsistent service areas/hours | Current contact-page FAQ says in-person Honolulu corridor with extended reach stated separately and statewide online. Hours in the site are appointment-based after 3 PM. A prior live search snippet showed broader/contradictory claims, so live-vs-source drift remains to verify. | Compare the rendered production copy, page source, business schema, Google Business Profile, and citations against `lib/business/config.ts`. Correct any production drift from the verified source. |
| Numerical and rating claims | Claims appear in homepage, metadata, staff/tutor pages, structured data, and `llms.txt`; report states source evidence was unavailable. | Create a claim register. Confirm definitions, underlying records, date, and owner for 300+, +15%, 5.0, 10+, and tutor credentials. Remove or soften only unsupported claims across all surfaces, including schema. |
| Local profile and citation consistency | Not inspected; current business model involves a partner location with private access after 2 PM. | Verify eligibility and how address, access, appointment requirements, hours, and service areas should be represented before changing GBP. Reconcile Yelp and other listings. |
| Search demand and ranking baseline | No GSC or keyword tool export found in connected Drive. | Connect/export data; obtain a Honolulu/Oʻahu and Hawaiʻi Keyword Planner file. Use first-party query data to refine priorities and distinguish demand from assumptions. |
| Page targeting | Strong service coverage already exists, but both priority service pages use short generic H1s (`Math Tutoring`, `SAT Prep`). The existing SAT title explicitly targets Honolulu and 1:1 tutoring; math title explicitly targets Honolulu. | Improve H1/opening copy and internal link emphasis for the core phrases while preserving unique page intent. Keep one-to-one SAT and group SAT as separate search destinations. |
| Sitemap dates / performance | Static last-modified dates are in source; prior PageSpeed API request was rate-limited. | Update dates when pages actually change, recrawl sitemap, and run a mobile performance report on home, math, and SAT pages. No score should be claimed until measured. |

## Primary keyword targets and page roles

| Priority | Page | Primary target | Supporting intent | Page-level change |
|---:|---|---|---|---|
| 1 | `/sat-prep-honolulu` | **SAT prep Honolulu**, **SAT tutor Honolulu** | SAT tutoring Hawaii/Oahu, Digital SAT tutor, SAT math tutor, SAT reading and writing tutor | H1 should explicitly say “SAT Prep & Tutoring in Honolulu.” Lead with personalized one-to-one Digital SAT coaching. Make diagnostic, practice format, tutor credentials, location/online delivery, and CTA easy to scan. |
| 2 | `/math-tutoring-honolulu` | **math tutor Honolulu**, **math tutoring Honolulu** | math tutor Oahu/Hawaii, algebra tutor, geometry tutor, calculus tutor, AP Calculus tutor | H1 should explicitly say “Math Tutoring in Honolulu.” Clarify K–12 levels and course coverage, diagnostic-led gap identification, in-person corridor and statewide online availability. |
| 3 | `/group-sat-prep` | **SAT prep classes Honolulu**, **group SAT prep Honolulu** | SAT prep course Hawaii, small-group SAT class, SAT classes Oahu | Keep clearly distinct from one-to-one page; foreground cohort size, hours, format, enrollment/start dates, and current schedule. Review date-sensitive program facts before each enrollment cycle. |
| 4 | `/` | tutoring Honolulu / Hawaii | Local private tutoring and broad brand discovery | Lead with local tutoring proposition, but direct users and internal link prominence toward Math and SAT. Home page should support both clusters without attempting to rank for every service. |

Keyword variants belong naturally in page copy, FAQs, and link text. Do not create separate pages for every grade, subject variant, neighborhood, or wording variation.

## Execution sequence

### Phase 1 — Establish a trustworthy baseline and fact set (Week 1)

1. Connect the verified Search Console property and export the most recent 16 months by query, page, device, and country. Preserve branded vs non-branded segments.
2. Export GA4 landing-page and conversion data for at least 90 days, preferably 12 months. Confirm contact submissions, calls, diagnostic completions, and booked consultations are tracked as separate events where possible.
3. Get a Google Ads Keyword Planner historical metrics export for the prioritized keyword list. Run separate geo settings for Honolulu/Oʻahu and all Hawaiʻi; document date range, language, network, and whether results are ranges.
4. Record current public business facts from the approved config: email, phone, in-person area, online area, hours, address/access language, and delivery modes. Create a claim register for numerical/credential assertions.
5. Verify production status for homepage, contact page, SAT page, math page, footer, JSON-LD, `llms.txt`, and sitemap. Treat source-vs-production differences as deploy/cache/indexing drift until confirmed otherwise.

**Gate:** no growth claim, profile edit, or new location page proceeds until relevant factual discrepancies are checked against the business owner’s verified facts.

### Phase 2 — Fix facts and conversion paths (Weeks 1–2)

1. If any public email, hour, area, location, or access statement is wrong in production, fix the source of truth and all dependent rendered surfaces together.
2. Review each numeric and credential claim with evidence. Keep supported claims with a dated method/definition; remove unsupported ones from visible copy, metadata, structured data, and `llms.txt`.
3. Ensure every SAT and math landing page has a direct consultation CTA, a working phone/email alternative, and a diagnostic route. Track form submission and diagnostic start/completion without exposing student data.
4. On the SAT page, clearly distinguish one-to-one tutoring from cohorts and link to `/group-sat-prep`. On the math page, clearly distinguish school-course tutoring from SAT Math and AP Calculus; link to the dedicated SAT/AP pages where relevant.

**Acceptance:** the production-rendered copy, metadata, structured data, footer, and `llms.txt` agree on approved business facts; both priority pages have clear service-specific CTAs and measurable conversion events.

### Phase 3 — Optimize SAT and math pages (Weeks 2–4)

**SAT page**

- Update H1 to explicitly target SAT prep/tutoring in Honolulu.
- Keep title focused on `SAT Prep in Honolulu | 1-on-1 SAT Tutoring`; check truncation and brand suffix.
- Rewrite first paragraph to plainly establish Honolulu one-on-one SAT tutoring, Digital SAT coverage, in-person/online options, and diagnostic-led plan.
- Add a compact section answering: what is covered, who it is for, how sessions work, how the diagnostic is used, and where sessions happen.
- Feature only verified tutor SAT results/credentials and substantiated student outcomes.
- Link conspicuously to group SAT and online tutoring, with anchor text that communicates the format.

**Math page**

- Update H1 to explicitly target math tutoring in Honolulu.
- Keep title focused on `Math Tutoring in Honolulu | K-12 Math Tutors`.
- Rewrite opening copy to say math tutor/tutoring in Honolulu naturally, then explain the diagnostic-led approach and the supported grade/course range.
- Present core course coverage as scannable groups (foundations, middle grades, high-school math, AP Calculus/statistics where supported).
- Add clear tutor-fit, delivery area, online statewide, and next-step information.
- Link contextually to SAT Math, AP tutoring, and statewide online tutoring without making this page compete with those pages.

**Home page and navigation**

- Make Math and SAT the two most prominent one-to-one service links and primary non-brand paths from the hero/service section.
- Maintain the distinct group SAT CTA as a secondary campaign path while enrollment is active.
- Ensure anchor text describes destinations (e.g. “Honolulu math tutoring,” “one-to-one SAT prep in Honolulu”).

**Acceptance:** rendered H1/title/description/opening paragraphs and internal links reflect the map; unique intent is preserved; no unsupported numerical claim is added.

### Phase 4 — Local visibility and authority (Weeks 3–6)

1. Review Google Business Profile access, eligibility, category, address visibility, service areas, appointment hours, contact details, and photos. Resolve the private partner-space representation with the business owner before publishing changes.
2. Reconcile Yelp, LinkedIn, and other meaningful local citations to the verified business name, phone, URL, address model, and operating details.
3. Request authentic family feedback using a neutral process; do not incentivize or filter for positive reviews. Reply without disclosing any student’s identity or educational information.
4. Publish one focused SAT resource and one math resource after page updates: a Digital SAT preparation pathway for Honolulu students and a family guide to selecting a math tutor/diagnosing math gaps. Each needs an identified KHM author/reviewer, original local insight, date, and direct service-page links.

### Phase 5 — Measure and reallocate (Weeks 6–12)

1. Review query/page performance for SAT and math separately. Identify queries with meaningful impressions but low CTR, high-impression pages with weak position, and qualified leads by organic entry page.
2. Check for query cannibalization between homepage, SAT one-to-one, group SAT, math, and AP pages; reinforce the intended destination with internal links and copy.
3. Run a fresh technical crawl and mobile Core Web Vitals measurement on homepage, SAT, and math pages. Fix material issues in indexability, broken links, mobile usability, LCP, INP, CLS, or oversized images.
4. Refresh title/H1/opening copy based on actual queries and conversion quality rather than keyword count.

## Measurement dashboard

Track monthly with the same date windows and note seasonality:

- Non-brand impressions, clicks, CTR, and average position for SAT and math query groups.
- Page-level impressions/clicks for `/sat-prep-honolulu`, `/math-tutoring-honolulu`, and `/group-sat-prep`.
- Organic leads: consultation requests, phone calls, diagnostic starts/completions, and qualified enrollment inquiries.
- Lead rate and qualified lead count by landing page and device.
- Local profile calls, website visits, direction requests (where applicable), review recency, and NAP accuracy.
- Indexed target URLs and mobile Core Web Vitals.

Set 90-day numerical targets only after the baseline is collected. Use year-over-year comparisons where possible because SAT and course tutoring demand are seasonal.

## Risks and guardrails

- Do not claim that adding a keyword to metadata alone will improve rank; focus on useful page content, local relevance, links, and conversion quality.
- Do not publish new neighborhood pages without distinct coverage proof and substantial unique value.
- Do not position the Kakaʻako partner space as a conventional walk-in tutoring storefront if that is inaccurate.
- Do not keep unsupported rating, score-lift, student-count, or credential claims in visible content or structured data.
- Do not treat keyword-tool search volume as KHM traffic or a promise of organic clicks.

## Work status

### Completed in the repository

- Repositioned the homepage title, description, and H1 around math tutoring and SAT prep in Honolulu.
- Added direct homepage links to the dedicated math and one-to-one SAT pages.
- Strengthened the SAT and math landing-page H1s, opening copy, and SAT description around their mapped local search intent.
- Removed unverified student-count, score-lift, tutor-count, and aggregate-rating claims from public summaries, structured FAQ copy, and the shared business configuration. Updated the free diagnostic and service copy to describe what the offer actually does.
- Updated the homepage and priority service sitemap modification dates to November 19, 2026.

### Still pending

- Search Console, GA4, and Keyword Planner exports are not connected/available, so the measured keyword baseline is still missing.
- Verify profile eligibility and facts before making Google Business Profile or directory changes.
- Review individual tutor credentials and testimonial permissions against source records. The current tutor biographies and testimonials remain pending this evidence review.
- Inspect production-rendered pages after deployment; the repository changes have not been published, so stale indexed snippets may persist until production is updated and recrawled.
- Run the post-deployment crawl and mobile performance review. No test/build or production deployment was run in this pass.
