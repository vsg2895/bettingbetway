import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST, Stars } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — the mockup's v4 opening: centred on the cream ground, the
            claim in DM Serif with its middle phrase in TRUE italic red (the
            face ships a real italic, so nothing is slanted synthetically),
            and the two ways in. */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[1200px] px-4 pb-20 pt-14 text-center sm:pb-[7.5rem] sm:pt-24">
            <p className="live inline-flex items-center gap-2.5 rounded-[2px] border-[1.5px] border-brand px-4 py-2 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-brand">
              {COPY.home.heroEyebrow}
            </p>
            <h1 className="mx-auto mt-7 max-w-[980px] font-display text-[44px] leading-[1] text-balance text-ink sm:text-[clamp(48px,7.4vw,108px)]">
              {COPY.home.heroHeadline}{' '}
              <em className="italic text-brand">{COPY.home.heroHighlight}</em>{' '}
              {COPY.home.heroHeadlineTail}
            </h1>
            <p className="mx-auto mt-6 max-w-[640px] text-[17px] text-ink-soft sm:text-xl">{COPY.home.heroSubtitle}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3.5">
              <Link href="/casinos" className="btn-or min-h-[56px] px-9 text-sm">
                {COPY.home.featuredCasinos}
              </Link>
              {anyOffersVisible && (
                <Link href="/special-offers" className="btn-ln btn-on-dark min-h-[56px] px-9 text-sm">
                  {COPY.home.specialOffers}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* The podium — the top three, pulled UP over the hero's bottom edge
            on a near-black block with the mockup's hard gold offset.

            The mockup prints a rank NUMERAL and a "Min. deposit" figure in
            each cell. Neither ships here: no casino card on this network shows
            a rank number, and nothing in the API holds a minimum deposit, so
            inventing one would put a figure on screen that no column backs.
            The big gold italic figure is the RATING — real data, and the same
            shape in the same slot. */}
        {casinos.length >= 3 && (
          <section className="relative z-[2] -mt-12 sm:-mt-[4.5rem]" aria-labelledby="podium-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <h2 id="podium-heading" className="sr-only">
                {COPY.home.podiumTitle}
              </h2>
              <ol className="hard-gold deep-panel grid grid-cols-1 min-[51.25rem]:grid-cols-3">
                {casinos.slice(0, 3).map((c) => (
                  <li
                    key={c.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-3 border-b border-night-line p-7 last:border-b-0 min-[51.25rem]:border-b-0 min-[51.25rem]:border-r min-[51.25rem]:last:border-r-0"
                  >
                    <span aria-hidden className="row-span-2 font-display text-[64px] italic leading-[0.9] text-accent">
                      {c.rating.toFixed(1)}
                    </span>
                    <span className="min-w-0">
                      <Link href={`/casinos/${c.slug}`} className="font-display text-[19px] text-night-ink hover:text-accent">
                        {c.name}
                      </Link>
                      <span className="mt-1.5 flex items-center gap-2 text-[13px] text-night-muted">
                        <Stars rating={c.rating} />
                        <span className="tabular-nums">{c.rating.toFixed(1)}</span>
                        <span className="sr-only"> {COPY.home.podiumRatingLabel}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* The ranking — category chips, then the casinos as rows. */}
        <section className="pb-14 pt-6 sm:pb-[72px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand">{COPY.home.rankingLabel}</p>
            <h2 id="top-casinos-heading" className="mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
              {COPY.home.topCasinosTitle}
            </h2>
            <p className="mt-3 max-w-[540px] text-ink-soft">{COPY.home.topCasinosSubtitle}</p>

            {categories.length > 0 && selected && (
              <div className="mt-6">
                <CategoryNav categories={categories} selected={selected} />
              </div>
            )}

            {casinos.length === 0 ? (
              <p className="mt-6 rounded-[18px] border border-dashed border-line bg-paper p-10 text-center text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={`mt-[22px] ${CASINO_LIST}`}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-6 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-12 px-[22px] text-[15px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bonus types as one stacked bar. Renders nothing without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pb-14 sm:pb-[72px]">
            <div className="mx-auto max-w-[1200px] px-4">
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* Bonuses — one card per type, built from the same getBonusArea
            payload as the mix bar and the menus. A site without the Bonus
            area keeps the flat grid below. */}
        {bonusSections.length > 0 ? (
          <section className="py-14 sm:py-[72px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="bonus-heading" className="font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
                  {COPY.home.bonus}
                </h2>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand-dark transition-colors hover:text-ink">
                  {COPY.home.viewAll}<span className="sr-only"> bonuses</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="py-14 sm:py-[72px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="offers-heading" className="font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
                  {COPY.home.specialOffers}
                </h2>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand-dark transition-colors hover:text-ink">
                  {COPY.home.viewAll}<span className="sr-only"> special offers</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <div className={`mt-6 ${OFFER_GRID}`}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How we rank — the stages of a review, as cards. */}
        <section className="border-y border-line bg-surface py-14 sm:py-[72px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand">{COPY.home.methodLabel}</p>
            <h2 id="method-heading" className="mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
              {COPY.home.methodTitle}
            </h2>
            <p className="mt-3 max-w-[540px] text-ink-soft">{COPY.home.methodSubtitle}</p>
            <ol className="mt-[34px] grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="step rounded-[2px] border border-line bg-paper p-[26px]">
                  <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-brand">
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[15px] font-bold text-white">{step.no}</span>
                    {step.verb}
                  </p>
                  <h3 className="mt-2.5 font-display text-[22px] text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink-soft">
              <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* FAQ — numbered accordion. Every answer is in the HTML, which the
            FAQPage schema above requires. */}
        <section aria-labelledby="faq-heading">
          {/* The head sits beside the questions and sticks while they
              scroll, from 820px up; below that it stacks above them. */}
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 min-[51.25rem]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="min-[51.25rem]:sticky min-[51.25rem]:top-[110px] min-[51.25rem]:self-start">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand">{COPY.home.faqLabel}</p>
              <h2 id="faq-heading" className="mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
                {COPY.home.faqTitle}
              </h2>
            </div>
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}
