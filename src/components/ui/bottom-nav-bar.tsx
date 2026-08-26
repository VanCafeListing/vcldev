import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import { Icon, type IconName } from './icon';

export type NavItem = {
  key: string;
  icon: IconName;
  label: string;
};

/**
 * The four destinations from the Figma tab bar.
 *
 * The third is a MAP, not favourites — favourites is reached from the Profile
 * menu instead.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: 'index', icon: 'TabHome', label: 'Home' },
  { key: 'search', icon: 'TabSearch', label: 'Search' },
  { key: 'map', icon: 'TabMap', label: 'Map' },
  { key: 'profile', icon: 'TabUser', label: 'Profile' },
];

/** Figma: 90pt tall bar, 32pt icons, shadow 0 -5px 12.4px rgba(0,0,0,0.15). */
const BAR_HEIGHT = 90;
const ICON_SIZE = 32;

type BottomNavBarProps = {
  items?: NavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
};

/**
 * The bottom tab bar: a cream surface spanning the full width with dark
 * red-brown icons, lifted by an upward shadow.
 *
 * Icons only — the design shows no text labels — so each control carries an
 * accessibility label instead.
 */
export function BottomNavBar({ items = NAV_ITEMS, activeKey, onSelect }: BottomNavBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.tabBar,
          height: BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
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
            {/* The design draws every icon in the same tone; the inactive tabs
                are dimmed rather than recoloured, since no active/inactive
                variant is specified. */}
            <Icon
              name={item.icon}
              size={ICON_SIZE}
              color={active ? colors.tabIcon : `${colors.tabIcon}99`}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12.4,
    shadowOffset: { width: 0, height: -5 },
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
