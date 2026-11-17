import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * One colour per bonus type, in order, each with the text colour that reads on
 * it at 4.5:1 or better. The mockup's six, the green a shade deeper (white on
 * its #2BA67A is about 3:1), and two more for sites with more types.
 */
const TYPE_COLOURS: ReadonlyArray<{ bg: string; fg: string }> = [
  { bg: '#c2552b', fg: '#ffffff' },
  { bg: '#1a1d33', fg: '#ffffff' },
  { bg: '#1f8a63', fg: '#ffffff' },
  { bg: '#3b5ba9', fg: '#ffffff' },
  { bg: '#d98a2b', fg: '#1a1d33' },
  { bg: '#7a4e9c', fg: '#ffffff' },
  { bg: '#2c7f8c', fg: '#ffffff' },
  { bg: '#a3485f', fg: '#ffffff' },
]

/** The catch-all's colour, wherever it does appear (its group on the home page). */
const CATCH_ALL_COLOUR = { bg: 'var(--color-ink-soft)', fg: '#ffffff' }

/**
 * The colour of each section, by slug — shared by the mix bar, its keys and
 * the home page's bonus groups, so a type is the same colour everywhere.
 */
export function bonusTypeColours(sections: BonusSection[]): Map<string, { bg: string; fg: string }> {
  const colours = new Map<string, { bg: string; fg: string }>()
  sections
    .filter((section) => section.slug !== CATCH_ALL_SLUG)
    .forEach((section, i) => colours.set(section.slug, TYPE_COLOURS[i % TYPE_COLOURS.length]))
  colours.set(CATCH_ALL_SLUG, CATCH_ALL_COLOUR)
  return colours
}

/**
 * "Browse by bonus type", from sites/bettingbetway.html (`.btypes`): ONE
 * hairline grid, a tall cell per bonus type — a round colour tile, the type's
 * name in the serif, and how many offers of it this site carries in the
 * corner. A cell fills gold on hover.
 *
 * The container draws the top and left rule and each cell its right and
 * bottom (`.btype` in globals.css), so the lines never double up and the grid
 * closes whatever number of cells lands on the last row.
 *
 * Each cell opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  const colours = bonusTypeColours(sections)
  const total = types.reduce((sum, section) => sum + section.offers_count, 0)

  return (
    <nav aria-labelledby="bonus-types-heading">
      <p className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand">
        {COPY.home.bonusTypesKicker}
      </p>
      <h2 id="bonus-types-heading" className="mb-[26px] mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
        {COPY.home.bonusTypesTitle}
      </h2>

      <ul className="grid grid-cols-2 border-l border-t border-ink sm:grid-cols-3 min-[68.75rem]:grid-cols-6" role="list">
        {types.map((section) => (
          <li key={section.id}>
            <Link
              href={`/bonuses/${section.slug}`}
              className="btype relative flex min-h-[170px] flex-col items-start justify-between gap-3.5 p-6 font-display text-[20px] text-ink"
            >
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                style={{ background: colours.get(section.slug)!.bg }}
              >
                {/* The type's own icon, as in the Bonus menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {section.icon_path && (
                  <img src={resolveImageUrl(section.icon_path)!} alt="" width={22} height={22} className="h-[22px] w-[22px]" />
                )}
              </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">{section.name}</span>
              <span className="absolute right-6 top-6 font-sans text-[13px] font-bold text-muted">
                {section.offers_count}
                <span className="sr-only"> {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
