/**
 * Legal document content, kept as data rather than JSX so a wording revision
 * is a content edit that cannot break rendering, and so both documents are
 * guaranteed to render identically.
 *
 * NOT LAWYER-REVIEWED. This text is a good-faith, plain-language description
 * of what the app actually does, written to be accurate rather than
 * authoritative. It must be reviewed by a qualified lawyer before public
 * launch, and the same text will need to be published at a public URL for the
 * App Store and Play Store listings.
 *
 * Bundled rather than fetched so the terms a user agreed to are readable
 * offline and always match the build that collected the consent.
 */
export type LegalSection = {
  heading: string;
  /** Each entry renders as its own paragraph. */
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  /** Date-based; a policy has no meaningful major/minor distinction. */
  version: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
};

export const TERMS_OF_USE: LegalDocument = {
  title: 'Terms of Use',
  version: '2026-08-29',
  effectiveDate: '29 August 2026',
  intro:
    'These terms cover your use of VanCafe Listing, an app for finding cafes in the Vancouver area that are suited to working from. By creating an account or using the app as a guest, you agree to what follows.',
  sections: [
    {
      heading: '1. Using the app',
      paragraphs: [
        'VanCafe Listing helps you find cafes and see what they offer for working — wifi, power outlets, seating, parking and general atmosphere. You may use it for your own personal, non-commercial use.',
        'You may browse as a guest. Creating an account additionally lets you save favourites and manage your profile.',
        'Please do not misuse the app: no attempting to break, overload or gain unauthorised access to it or its backend, no scraping or bulk-extracting the cafe data, and no using it to harass anyone.',
      ],
    },
    {
      heading: '2. Cafe information is a guide, not a guarantee',
      paragraphs: [
        'This is the most important thing to understand about this app. Cafe details — including wifi and power-outlet availability, seat counts, opening status, prices, ratings and photos — come from a mix of our own records and third-party sources including Google Maps and Places. Some of it is contributed or estimated.',
        'It can be wrong, incomplete, or out of date. Businesses change, close, remove outlets, or stop offering wifi without telling anyone. Ratings and photos reflect what Google held at the time we last synced, not a live feed.',
        'Do not rely on this app for anything that matters. Check with the cafe directly before travelling, and especially before depending on wifi or an outlet for work. We are not responsible for a wasted trip.',
      ],
    },
    {
      heading: '3. Your account',
      paragraphs: [
        'You are responsible for keeping your password secure and for activity that happens under your account. Tell us promptly if you believe someone else has accessed it.',
        'Give accurate information when you sign up. Do not impersonate anyone or create an account on behalf of someone else without their permission.',
        'You can delete your account at any time from the Profile screen. Deleting your account removes your profile and your saved favourites. This cannot be undone.',
        'We may suspend or end access to an account that breaches these terms.',
      ],
    },
    {
      heading: '4. Your content',
      paragraphs: [
        'Anything you add — your name, profile photo and saved favourites — remains yours. You give us permission to store and display it back to you as part of running the app.',
        'Do not upload a profile photo that you do not have the rights to use, or that is unlawful, hateful or obscene.',
      ],
    },
    {
      heading: '5. Third-party services',
      paragraphs: [
        'The app relies on services we do not control: Supabase for accounts and data storage, Google Maps and Google Places for maps, cafe listings and photos, and Expo for app delivery.',
        'Cafe photos and rating data are provided by Google and remain subject to Google’s own terms. Opening directions hands you off to whichever maps app your device uses.',
        'Cafes named in the app are independent businesses. We are not affiliated with them, do not act on their behalf, and do not endorse them.',
      ],
    },
    {
      heading: '6. Location',
      paragraphs: [
        'If you allow it, the app uses your device location while it is open, to sort cafes by distance and centre the map near you. You can refuse or later revoke this in your device settings; the app still works, and simply lists cafes without distances.',
      ],
    },
    {
      heading: '7. Availability',
      paragraphs: [
        'The app is provided as it is, without warranties of any kind. We do not promise it will always be available, error-free, or that the information in it is accurate or current.',
        'To the fullest extent the law allows, we are not liable for any loss arising from your use of the app or your reliance on information in it — including a cafe turning out to be closed, full, or lacking the wifi or outlets the app listed.',
        'Nothing here limits liability that cannot legally be limited.',
      ],
    },
    {
      heading: '8. Changes to these terms',
      paragraphs: [
        'We may update these terms as the app changes. The version identifier and effective date at the top of this screen tell you which revision you are reading.',
        'If we make a significant change, we will make it apparent in the app rather than changing it quietly. Continuing to use the app after a change means you accept the updated terms.',
      ],
    },
    {
      heading: '9. Contact',
      paragraphs: [
        'Questions about these terms can be sent to the address on our listing in the App Store or Google Play.',
      ],
    },
  ],
};
