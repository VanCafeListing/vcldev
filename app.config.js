const GOOGLE_MAPS_ANDROID_API_KEY = process.env.GOOGLE_MAPS_ANDROID_API_KEY;

if (!GOOGLE_MAPS_ANDROID_API_KEY) {
  throw new Error('GOOGLE_MAPS_ANDROID_API_KEY is required to configure Google Maps on Android.');
}

module.exports = ({ config }) => ({
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
});
