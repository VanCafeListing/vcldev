## 1. Data Layer

- [x] 1.1 Build `getFavouritedCafes(userId)`: a Postgrest query joining `favourites` → `cafes` for the current user
- [x] 1.2 Add the `['favourites', userId, 'full']` TanStack Query hook; ensure the existing toggle mutation invalidates both this and the id-only cache

## 2. Favourites Screen

- [x] 2.1 Build `app/favourites.tsx` (stack route pushed from Profile, NOT a tab): guest check first (session/guest state) → sign-in/sign-up prompt if guest
- [x] 2.2 Authenticated: render the card list via `getFavouritedCafes`, reusing `cafe-discovery`'s card component
- [x] 2.3 Empty state for zero favourites
- [x] 2.4 Wire card taps to the existing cafe detail route
- [x] 2.5 Wire heart-icon taps to the existing favourite-toggle mutation; confirm the card disappears from this list immediately on unfavourite

## 3. Verification

- [x] 3.1 Authenticated user with favourites sees them listed with correct card data (verified by code review, not live — no test account credentials were available this session, and creating a new account to test is outside what this session can do; `getFavouritedCafes` mirrors `searchCafes`'s already-verified query shape)
- [x] 3.2 Authenticated user with no favourites sees the empty state (verified by code review — same `ListEmptyComponent` pattern as the already-verified Search screen)
- [x] 3.3 Unfavouriting from this screen removes the card immediately, no manual refresh needed (verified by code review — `onMutate` optimistically filters the card out of the `['favourites', userId, 'full']` cache)
- [x] 3.4 Tapping a card opens the correct cafe's detail screen (verified by code review — identical `router.push('/cafe/${item.id}')` call already verified live on the Search screen)
- [x] 3.5 Guest opening the Favourites screen sees a sign-in/sign-up prompt and triggers no favourites query (verified live via simulator: guest deep-link to `/favourites` shows the prompt; `useFavouritedCafes` is `enabled: Boolean(userId)`, same gating pattern as `useFavouriteIds`)
