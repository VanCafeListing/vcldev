import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

type LocationState =
  | { status: 'loading' }
  | { status: 'granted'; coords: { lat: number; lng: number } }
  | { status: 'denied' };

/**
 * Requests foreground location once on mount. Denial is a normal, expected
 * outcome here — the Home feed falls back to an unsorted list rather than
 * blocking, so this never surfaces an error state of its own.
 */
export function useUserLocation(): LocationState {
  const [state, setState] = useState<LocationState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!active) return;

      if (status !== 'granted') {
        setState({ status: 'denied' });
        return;
      }

      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!active) return;
        setState({
          status: 'granted',
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
        });
      } catch {
        if (active) setState({ status: 'denied' });
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
