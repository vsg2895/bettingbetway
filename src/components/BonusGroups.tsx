import Link from 'next/link'
import { COPY } from '@/constants/copy'
import { OfferRow } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses: one card per bonus type, two across on a wide
 * screen, each with its offers as rows.
 *
 * Built in this site's own language rather than the sibling sites' — which is
 * the point, since all three serve the same catalogue and a reader comparing
 * them should not meet the same block three times:
 *
 *  - the head is a GOLD BAR, the same device `SpecialOfferCard` leads with, so
 *    a bonus type and a bonus offer are marked the same way across the site;
 *  - the type's name is set in the display serif at 400, and HOW MANY OFFERS
 *    of it this site carries is a big serif ITALIC figure — the treatment the
 *    podium and the casino cards give a rating. The count is the site's own
 *    `offers_count`, resolved server-side;
 *  - hairline ink borders and a 2px radius, and on hover the card takes the
 *    design's hard `6px 6px 0` ink offset. No blur anywhere, no colour dot.
 *
 * There is deliberately no per-type colour here. This site marks a bonus type
 * by its position in a hairline grid, not by a swatch, and a row of coloured
 * dots would be the one soft, decorative thing on a page built from rules.
 *
 * Every type's offers are in the server HTML, and each card keeps the
 * `#bonus-<slug>` anchor the bonus-type grid's cells land on.
 *
 * A GRID, not `columns-2`. CSS multi-column balances the two columns against
 * each other, so the second card began lower than the first and the pair never
 * shared a top edge. Grid cells on one row start together by definition.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="mt-[26px] grid items-start gap-5 lg:grid-cols-2">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-24 overflow-hidden rounded-[2px] border border-ink bg-paper transition-shadow duration-150 hover:shadow-[6px_6px_0_var(--color-ink)] focus-within:shadow-[6px_6px_0_var(--color-ink)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink bg-accent px-5 py-4">
            <h3 id={`bonus-${section.slug}-heading`} className="flex min-w-0 items-baseline gap-3 font-display text-[22px] leading-tight text-accent-ink">
              {/* The count in the figure slot the rest of the site gives a
                  rating — aria-hidden because the heading's own words below
                  already name the type, and the number is read out there. */}
              <span aria-hidden className="shrink-0 text-[32px] italic leading-none">{section.offers_count}</span>
              <span className="[overflow-wrap:anywhere]">{section.name}</span>
              <span className="sr-only"> — {section.offers_count} offers</span>
            </h3>
            <Link
              href={`/bonuses/${section.slug}`}
              className="-my-3 inline-flex min-h-11 items-center py-3 text-sm font-bold text-accent-ink underline decoration-1 underline-offset-4 transition-colors hover:text-brand"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1">→</span>
            </Link>
          </div>
          {section.description && <p className="border-b border-line px-5 py-3 text-sm text-ink-soft">{section.description}</p>}
          <ul role="list">
            {section.offers.map((offer) => <OfferRow key={offer.id} offer={offer} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
