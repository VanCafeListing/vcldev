import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps } from 'react';

import { useTheme } from '@/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type NavItem = {
  key: string;
  icon: IoniconName;
  label: string;
};

/**
 * The four destinations from the design's nav bar.
 *
 * Note the third is a MAP, not favourites — the design draws a location pin on
 * a folded map. Favourites is reached from the Profile menu instead.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: 'index', icon: 'home-outline', label: 'Home' },
  { key: 'search', icon: 'search-outline', label: 'Search' },
  { key: 'map', icon: 'map-outline', label: 'Map' },
  { key: 'profile', icon: 'person-outline', label: 'Profile' },
];

type BottomNavBarProps = {
  items?: NavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
};

/**
 * The floating brown pill from the mockup. Icons only — the design shows no
 * text labels — so each control carries an accessibility label instead.
 */
export function BottomNavBar({ items = NAV_ITEMS, activeKey, onSelect }: BottomNavBarProps) {
  const { colors, radii, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, spacing.md), paddingHorizontal: spacing.xl },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.primary,
            borderRadius: radii.pill,
            paddingVertical: spacing.lg,
          },
        ]}
      >
        {items.map((item) => {
          const active = item.key === activeKey;

          return (
            <Pressable
              key={item.key}
              onPress={() => onSelect(item.key)}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons
                name={item.icon}
                size={26}
                // The design draws every icon in the same light tone; the
                // active tab is indicated by the filled variant.
                color={colors.onPrimary}
                style={{ opacity: active ? 1 : 0.75 }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
