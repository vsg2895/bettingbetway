type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/bettingbetway.html (`.faq`/`.fq`): one column of
 * hairline-separated rows, each opening on a round `+` that rotates into a
 * `×` and fills brand red. The first is open.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only the mockup's mark shows.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="border-t-2 border-ink">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-[21px] leading-[1.25] text-ink [overflow-wrap:anywhere] sm:text-2xl">{item.question}</h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span
              aria-hidden
              className="grid h-9 w-9 flex-none place-items-center rounded-full border border-ink text-xl leading-none transition-transform duration-200 group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-white"
            >
              +
            </span>
          </summary>
          <p className="max-w-[760px] pb-6 text-base leading-[1.75] text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
