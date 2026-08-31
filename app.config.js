const GOOGLE_MAPS_ANDROID_API_KEY = process.env.GOOGLE_MAPS_ANDROID_API_KEY?.trim();

module.exports = ({ config }) => {
  // Allow `npm start` / iOS / Expo Go without a key. Android maps will just
  // show blank tiles until a real key is set — no need to edit map.tsx.
  if (!GOOGLE_MAPS_ANDROID_API_KEY) {
    console.warn(
      '[app.config] GOOGLE_MAPS_ANDROID_API_KEY not set — Android MapView will render without Google tiles. ' +
        'Add it to .env (see .env.example) for full Android maps. iOS uses Apple Maps and is unaffected.'
    );
    return config;
  }

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      [
        'react-native-maps',
        {
          androidGoogleMapsApiKey: GOOGLE_MAPS_ANDROID_API_KEY,
        },
      ],
    ],
  };
};
