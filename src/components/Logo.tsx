import Link from 'next/link'

/**
 * BettingBetway brand mark, from sites/bettingbetway.html: a brick-red disc
 * with a gold ring and a gold centre — a target, for "the better way to pick".
 * Then the wordmark, "Betway" in the brand red, over a spaced-capital tagline.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * `onDark` is for the near-black newsletter band and footer: the disc keeps
 * its red, which holds up there, and the wordmark turns cream with the second
 * half in gold. One component, so the header's mark and the footer's can never
 * drift apart.
 */
export default function Logo({
  className = '',
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 42 42" className="h-[40px] w-[40px] shrink-0" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <circle cx="21" cy="21" r="21" fill="var(--color-brand)" />
        <circle cx="21" cy="21" r="13" fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <circle cx="21" cy="21" r="4" fill="var(--color-accent)" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display text-[20px] tracking-[-0.03em] sm:text-[22px] ${onDark ? 'text-night-ink' : 'text-ink'}`}>
          Betting<span className={onDark ? 'text-accent' : 'text-brand'}>Betway</span>
        </span>
        <span className={`mt-[5px] text-[10.5px] font-bold uppercase tracking-[0.2em] ${onDark ? 'text-night-faint' : 'text-muted'}`}>
          Casino &amp; betting guide
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
