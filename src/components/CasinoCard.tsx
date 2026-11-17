import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many region chips a card shows before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/** Exported so the home page's podium shows the same stars as a card. */
export function Stars({ rating }: { rating: number }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 18px reads as a rendering fault. The
  // exact figure is printed beside it either way.
  const filled = Math.round(rating)

  return (
    <span
      className="inline-flex items-center tracking-[1px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? 'text-gold' : 'text-line-soft'} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the cards sit in — the mockup's `.list`. Callers render
 * `<ol className={CASINO_LIST}>`; the order of the list is the ranking.
 * Self-sizing so the columns fall from three to one on their own.
 */
export const CASINO_LIST = 'grid grid-cols-1 gap-5 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'

/**
 * A casino as a stacked card — `.ccard` in sites/bettingbetway.html: the
 * rating as a big italic serif figure, a near-black logo plate, the name, the
 * regions it accepts, the welcome offer set in brand red, and the two actions.
 * On hover or keyboard focus the card takes the design's hard ink offset
 * (globals.css) — no blur anywhere on this site.
 *
 * Cards in a grid, NOT rows: three across at full width, falling to one.
 *
 * The mockup prints a rank NUMERAL in the figure slot; this network does not —
 * no casino card on any site shows one, the `<ol>` order is the ranking. The
 * slot holds the RATING instead: the same big gold-ink italic figure, but a
 * number that real data backs. `rank` is still accepted so callers did not
 * have to change. The first card takes the mockup's warm gold wash (`.rw`),
 * which is what marks the leader out.
 *
 * The chips carry `countries`, real attached data.
 */
export default function CasinoCard({
  casino,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length

  return (
    <li className="rw flex flex-col gap-4 rounded-xl p-[22px]">
      <div className="flex items-start justify-between gap-4">
        {/* The rating as the mockup's display figure. aria-hidden because the
            Stars below already announce it — this is the same number twice. */}
        <span aria-hidden className="font-display text-[46px] italic leading-none text-ink">
          {casino.rating.toFixed(1)}
        </span>
        <span className="flex flex-col items-end gap-1.5 pt-1">
          <Stars rating={casino.rating} />
        </span>
      </div>

      {/* The logo plate. WHITE whenever there IS artwork: operator logos
          arrive with their own white ground baked in, and any other colour
          behind one shows as a hard rectangle. With no artwork the plate
          becomes the mockup's near-black tile with the operator's name in
          gold — which is the only case the mockup itself ever draws. */}
      <div
        className={`flex h-[86px] items-center justify-center overflow-hidden rounded-[2px] p-2 ${
          image ? 'border border-line bg-white' : 'bg-navy'
        }`}
      >
        {image ? (
          <Image src={image} alt={`${casino.name} logo`} width={320} height={200} sizes="300px" className="h-full w-full object-contain" />
        ) : (
          <span className="px-1 text-center font-display text-[17px] leading-tight text-accent [overflow-wrap:anywhere]">
            {casino.name}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-[26px] leading-[1.1] text-ink [overflow-wrap:anywhere] sm:text-[28px]">{casino.name}</h3>

        {shownRegions.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Accepts players from">
            {shownRegions.map((country) => (
              <li key={country.id} className="rounded-[2px] border border-win px-[9px] py-[3px] text-xs font-bold text-win">
                {country.name}
              </li>
            ))}
            {extraRegions > 0 && (
              /* A count, not a tooltip: the full list is on the review page,
                 and a hover affordance is invisible on a phone. */
              <li className="rounded-[2px] border border-muted px-[9px] py-[3px] text-xs font-bold text-muted">+{extraRegions} more</li>
            )}
          </ul>
        )}

        {/* The welcome offer, set in the brand red rather than on a pill —
            the mockup strips the chip here. Dropped entirely when the
            operator has none. */}
        {casino.bonuses && (
          <p className="mt-3 text-[18px] font-bold leading-snug text-brand [overflow-wrap:anywhere]">{casino.bonuses}</p>
        )}
      </div>

      {/* Pushed to the bottom so every card in a row ends on its buttons,
          whatever length the name and offer run to. */}
      <div className="mt-auto grid gap-2.5 pt-1">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-or min-h-[46px] whitespace-nowrap px-4 text-sm"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link href={`/casinos/${casino.slug}`} className="btn-ln min-h-[46px] whitespace-nowrap px-4 text-sm">
          {COPY.casinos.readReview}
        </Link>
      </div>
    </li>
  )
}
