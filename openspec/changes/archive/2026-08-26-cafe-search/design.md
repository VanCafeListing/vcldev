## Context

`cafe-discovery` owns the cafe card, the cafe queries and the detail route; `cafe-filters` owns the Filters sheet and its criteria. This change adds the Search screen on top of both, plus the only two pieces of data the app needs that `data-model` does not already provide. See proposal.md for motivation and specs/cafe-search/spec.md for the behaviour contract.

## Goals / Non-Goals

**Goals:**
- The Search screen as drawn in Figma 75:2474, reusing existing primitives rather than inventing new ones.
- Search history that is per-user, private, and durable across restarts.
- A recommendation list that is honest about being curated rather than pretending to be personalised.

**Non-Goals:**
- Personalised or algorithmic recommendations. Nothing in the design implies ranking by behaviour, and the app has no signal to rank on.
- Searching anything but the cafe name — no description, address or amenity text search. The design shows a single plain input.
- In-app curation UI. Cafes are admin/seed-provisioned, and so is their recommended ordering.

## Decisions

**Recent searches in Postgres, not on-device.**
The spec requires history to be private per user and to survive a restart. Device-local storage satisfies "survives a restart" but not "belongs to the user" — it would leak between accounts on a shared device and vanish when they change phones. A `recent_searches` table with the same owner-only RLS as `favourites` gets both properties and reuses a pattern already in the schema. Guests simply write nothing, which is why the spec omits their history rather than inventing an anonymous one.

**De-duplicate by bumping a timestamp, not by inserting rows.**
`recent_searches` carries a unique constraint on `(user_id, query)`; re-searching an existing term updates its timestamp instead of adding a duplicate. Ordering is by that timestamp descending, so the chips are genuinely "most recent" and the list cannot fill with repeats.

**Cap the chips in the query, not by deleting history.**
The screen shows only a handful of chips, so the query takes the top N by recency. Old rows are left alone rather than pruned — the volume is trivial and a delete policy is complexity with no user-visible benefit.

**Recommendations as a nullable ordering column on `cafes`, not a separate table.**
`cafes.recommended_rank integer` — null means not recommended, otherwise lower sorts first. A join table would model the same one-to-one fact with more machinery, and there is no second dimension (no per-user recommendations) to justify it. Curation happens wherever cafe rows are provisioned.

**The filter button is the designed one; the Home overflow icon is not confirmed.**
Search's `mage:filter` button is drawn explicitly, so it opens the Filters sheet. Home's `tabler:dots-filled` is drawn but unlabelled — see Open Questions.

## Risks / Trade-offs

- [Risk] Writing a history row on every submitted query adds a write to a very common interaction → Mitigation: it is a single upsert, fire-and-forget, and failure to record history must never block showing results.
- [Risk] Recording raw query text ties user-entered strings to a user id → Mitigation: owner-only RLS, and the rows cascade away with the account like every other user-owned table.
- [Risk] Curated recommendations go stale if nobody maintains them → Mitigation: a null column simply yields an empty section, which is a visible prompt to curate rather than a broken screen.

## Open Questions

These do not change the specs, the approach, or the task breakdown — each has a working default — but they should go to the designers.

- Are the two amenity-tile greens on the cafe detail screen (`#dbf897` Outlet, `#d3efb0` Wifi) deliberate, or drift between two similar swatches? Default: implement both as drawn.
- What does Home's `tabler:dots-filled` icon open? Default: the Filters sheet, matching Search's filter button.
- Home (70:2397) and Home_1 (81:2460) show two cafe-card treatments. Which is current? Default: 70:2397, the frame named plainly "Home".
- Is "Recommendation" intended as curated, or as a placeholder for something computed later? Default: curated, per the decision above.

## Migration Plan

1. Migration: `recent_searches` (user_id, query, updated_at, unique on the pair) with owner-only RLS; add `cafes.recommended_rank`.
2. Seed a couple of recommended cafes so the section is exercisable.
3. Build the Search screen shell: heading, labelled input, filter button.
4. Wire the query against cafe names, with the no-results state.
5. Wire recent-search recording, the chips, and re-running a chip.
6. Wire the Recommendation list and its route into cafe detail.
