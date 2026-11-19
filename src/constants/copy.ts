/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * nine brands are separate domains serving the same catalogue, and if they
 * shipped the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * bettingbetway's angle: THE BETTER WAY TO CHOOSE. The reader has a shortlist
 * and wants to know which name on it to trust, so the writing is about the
 * choosing — what we look at, in what order, and why a headline bonus figure
 * is the least useful thing on an operator's page. Taken from the brief in
 * sites/bettingbetway.html.
 *
 * ── Three lines this file does not cross ────────────────────────────────────
 * 1. The mockup's lead says "real accounts, real deposits, real withdrawals"
 *    and its podium prints a "Min. deposit" per casino. Neither ships: nothing
 *    here records a funded test account or a deposit minimum, so no wording
 *    claims one. What this site can honestly say is that it reads the terms
 *    rather than the banner, which is what the copy says instead.
 * 2. The mockup also sells "casinos and sportsbooks". The API serves casinos,
 *    so every line here says casinos.
 * 3. The mockup's cards carry a per-casino "Avg. payout time" and a score out
 *    of five. There is no column behind either one on a site configured like
 * this (operator profiles are off, and nothing records a timed withdrawal per
 * operator), so no wording here promises a figure of that kind. The vocabulary
 * is the mockup's; the numbers are only ever `casino.rating`, which is real.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Casino Reviews & Bonuses',
    description:
      'ranks online casinos on the terms behind the headline: what a bonus actually costs to clear, how withdrawals are capped, and who holds the licence.',
    keywords: [
      'online casino reviews',
      'casino bonus terms compared',
      'wagering requirement explained',
      'casino withdrawal limits',
      'licensed casino rankings',
    ],
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    bonus: 'Bonuses',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row used to carry no heading at all — the chips were taken to
     * speak for themselves. They do not: arriving mid-page at a band of
     * unlabelled buttons between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * eleven sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Browse by bonus type',
    heroEyebrow: 'Independent casino rankings',
    // Split in two so the JSX keeps its emphasised highlight while the words
    // change. The highlight is the brand's own phrase.
    // Split in three so the JSX can set the middle phrase in the serif's TRUE
    // italic, which is the hero's whole device.
    heroHeadline: 'There’s a',
    heroHighlight: 'better way',
    heroHeadlineTail: 'to pick where you play.',
    heroSubtitle:
      'We rank casinos on what sits behind the banner — the wagering terms, the withdrawal limits and the licence — not on the size of the number out front.',
    podiumTitle: 'Editor’s top three',
    podiumRatingLabel: 'out of five',
    topCasinosTitle: 'Top rated casinos',
    topCasinosSubtitle: 'Ranked on bonus terms, withdrawal conditions and licensing. Filter by category.',
    featuredCasinos: 'Browse rankings',
    specialOffers: 'See bonus offers',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'The Better Way To Pick A Casino',
    faqTitle: 'Questions, answered',
    metaDescription:
      'Online casinos ranked on the terms behind the headline: what a bonus costs to clear, how withdrawals are capped, and who holds the licence.',
    // ── The "How we rank a casino" band ───────────────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    methodTitle: 'How we rank a casino',
    methodSubtitle: 'Every casino on this list goes through the same three checks, in the same order.',
    methodSteps: [
      {
        no: '01',
        verb: 'Read',
        title: 'Terms, in full',
        body:
          'The wagering multiplier and what it applies to, the minimum deposit, the withdrawal cap and the expiry — taken from the operator’s own terms page rather than from the promo banner.',
      },
      {
        no: '02',
        verb: 'Rank',
        title: 'Placed against the rest',
        body:
          'An operator is ordered against the others in its category on what those terms actually cost a player, not on how loudly the headline figure is advertised.',
      },
      {
        no: '03',
        verb: 'Re-check',
        title: 'Read again, later',
        body:
          'Terms change quietly. Offers that have lapsed come off the list, revised ones are re-read, and a casino moves when its reading moves.',
      },
    ],
    methodLabel: '03 — How we rank',
    // Under the three stages: the cycle closes back on the first.
    methodLoop: 'And back to the start whenever an operator changes its terms',
    // ── The hero monitor: what one pass re-reads ─────────────────────────
    // The same three things the FAQ and the method name — no figure this
    // site does not hold.
    monitorTitle: 'What each pass re-reads',
    monitorStatus: 'On a cycle',
    monitorReads: [
      { label: '01 · Bonus terms', text: 'Wagering, min deposit, cap, expiry' },
      { label: '02 · Payout', text: 'Withdrawal conditions and methods' },
      { label: '03 · Support', text: 'Whether support cover holds up' },
    ],
    monitorNote: 'A casino moves when its reading moves. Lapsed offers come off the list.',
    rankingLabel: '01 — The rankings',
    bonusTypesKicker: '02 — Pick your perk',
    bonusesLabel: '04 — On the table',
    faqLabel: '05 — Fine print',
  },
  casinos: {
    pageTitle: 'Every Casino We Track',
    pageDescription:
      'The full list, with each operator’s current reading: the bonus on offer, the terms attached to it, and where it places in its category.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Bonuses At This Casino',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'More top casinos this cycle',
    reviewTitleTail: 'Current Reading',
    reviewSignature: 'Bonus terms read in full, and re-read on a cycle.',
    reviewSummary: 'with its bonus terms read in full and its placement re-checked on a cycle.',
    visitCasino: 'Go To Casino',
    readReview: 'Read Review',
    rating: 'BettingBetway score',
    noResults: 'No casinos match this filter yet. Try another category.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every bonus of this kind on the board right now, with the terms that come attached.',
    countOne: 'bonus',
    countMany: 'bonuses',
  },

  specialOffers: {
    pageTitle: 'Bonuses On The Board',
    pageDescription:
      'Every bonus currently listed here, with the wagering requirement, the minimum deposit and the withdrawal cap stated wherever the operator states them.',
    // Appended to an offer's (shared) bonus text so the nine sites do not ship
    // an identical meta description for the same offer.
    offerMetaSuffix: 'Terms read from the operator’s own page before it went on the board.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses are on the board right now.',
  },
  categories: {
    pageTitle: 'Casino Categories',
    pageDescription:
      'Same reading behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the nine sites distinct there.
    categoryMetaSuffix: 'ordered by their current reading: bonus terms, payout conditions and support cover.',
    noResults: 'Nothing on the board here yet.',
  },
  newsletter: {
    title: 'The shortlist, every week.',
    subtitle: 'New reviews, the bonuses whose terms actually hold up, and any ranking that moved.',
    placeholder: 'Email when the terms change',
    button: 'Subscribe',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design, unlike the two-column siblings where the
    // same string had to stay on one.
    tagline:
      'Independent casino rankings, re-read on a cycle. We may earn a commission from links on this site; it never changes a placement.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    // Supplied 2026-11-18, replacing the address this site INHERITED from
    // betpulsehq when it was cloned — three sibling domains were publishing
    // one operator's address, which is a compliance problem rather than a
    // cosmetic one. Must stay identical to this site's `registered_address`
    // in the admin (Sites -> Edit -> Legal identity), which is what the legal
    // pages and the email templates print.
    postalAddress: '25 Birchwood Lane, Southampton, SO16 7PQ, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not on the list.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'Player Reports',
    empty: 'No reports yet — be the first to say how this one played.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether the terms matched',
    bodyPlaceholder: 'How did it actually go — payouts, verification, support?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
