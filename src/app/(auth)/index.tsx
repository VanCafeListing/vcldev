import { Redirect } from 'expo-router';

/** The auth stack always opens on the splash screen. */
export default function AuthIndex() {
  return <Redirect href="/(auth)/splash" />;
}
