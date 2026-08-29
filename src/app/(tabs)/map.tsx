import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';

import { cafesQueryOptions } from '@/lib/cafes';
import { useFilters } from '@/lib/filters-context';
import { useUserLocation } from '@/lib/use-user-location';
import { useTheme } from '@/theme';

const VANCOUVER_REGION: Region = {
  latitude: 49.2827,
  longitude: -123.1207,
  latitudeDelta: 0.16,
  longitudeDelta: 0.16,
};

const USER_REGION_DELTA = 0.06;

/** Map tab: shared filters, location-aware centring, cafe pins and callouts. */
export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const location = useUserLocation();
  const { criteria, isActive } = useFilters();
  const { colors, radii, spacing, typography } = useTheme();

  const cafesQuery = useQuery({
    ...cafesQueryOptions(location, criteria),
    enabled: location.status !== 'loading',
  });

  const cafesWithCoordinates = useMemo(
    () =>
      (cafesQuery.data ?? []).filter(
        (cafe): cafe is typeof cafe & { lat: number; lng: number } =>
          cafe.lat != null && cafe.lng != null
      ),
    [cafesQuery.data]
  );

  useEffect(() => {
    if (location.status !== 'granted') return;

    mapRef.current?.animateToRegion(
      {
        latitude: location.coords.lat,
        longitude: location.coords.lng,
        latitudeDelta: USER_REGION_DELTA,
        longitudeDelta: USER_REGION_DELTA,
      },
      350
    );
  }, [location]);

  const isLoading = location.status === 'loading' || cafesQuery.isLoading;
  const noMatches = !isLoading && !cafesQuery.isError && cafesWithCoordinates.length === 0;

  return (
    <View style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={VANCOUVER_REGION}
        showsUserLocation={location.status === 'granted'}
        showsMyLocationButton={location.status === 'granted'}
        accessibilityLabel={`Cafe map, ${cafesWithCoordinates.length} cafes`}
      >
        {cafesWithCoordinates.map((cafe) => (
          <Marker
            key={cafe.id}
            coordinate={{ latitude: cafe.lat, longitude: cafe.lng }}
            title={cafe.name}
            description={cafe.address ?? 'Open cafe details'}
            pinColor={colors.primary}
            accessibilityLabel={`${cafe.name} map marker`}
            onCalloutPress={() => router.push(`/cafe/${cafe.id}`)}
          />
        ))}
      </MapView>

      {isLoading ? (
        <View
          style={[
            styles.message,
            { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md },
          ]}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading cafes"
        >
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}

      {noMatches ? (
        <View
          style={[
            styles.message,
            { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.lg },
          ]}
          accessibilityRole="alert"
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.md,
              textAlign: 'center',
            }}
          >
            {isActive ? 'No cafes match these filters.' : 'No cafes to show yet.'}
          </Text>
        </View>
      ) : null}

      {cafesQuery.isError ? (
        <View
          style={[
            styles.message,
            { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.lg },
          ]}
          accessibilityRole="alert"
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.md,
              textAlign: 'center',
            }}
          >
            Unable to load cafes.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  message: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
