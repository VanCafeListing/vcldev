## 1. Data Layer

- [ ] 1.1 Build `getFavouritedCafes(userId)`: a Postgrest query joining `favourites` → `cafes` for the current user
- [ ] 1.2 Add the `['favourites', userId, 'full']` TanStack Query hook; ensure the existing toggle mutation invalidates both this and the id-only cache

## 2. Favourites Screen

- [ ] 2.1 Build `app/favourites.tsx` (stack route pushed from Profile, NOT a tab): guest check first (session/guest state) → sign-in/sign-up prompt if guest
- [ ] 2.2 Authenticated: render the card list via `getFavouritedCafes`, reusing `cafe-discovery`'s card component
- [ ] 2.3 Empty state for zero favourites
- [ ] 2.4 Wire card taps to the existing cafe detail route
- [ ] 2.5 Wire heart-icon taps to the existing favourite-toggle mutation; confirm the card disappears from this list immediately on unfavourite

## 3. Verification

- [ ] 3.1 Authenticated user with favourites sees them listed with correct card data
- [ ] 3.2 Authenticated user with no favourites sees the empty state
- [ ] 3.3 Unfavouriting from this screen removes the card immediately, no manual refresh needed
- [ ] 3.4 Tapping a card opens the correct cafe's detail screen
- [ ] 3.5 Guest opening the Favourites screen sees a sign-in/sign-up prompt and triggers no favourites query
