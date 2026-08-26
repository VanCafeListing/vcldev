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
 * The four destinations from the PDF tab bar.
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

/** PDF: a floating brand-brown pill, ~72pt tall, 28pt white icons. */
const BAR_HEIGHT = 72;
const ICON_SIZE = 28;
const SIDE_MARGIN = 20;

type BottomNavBarProps = {
  items?: NavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
};

/**
 * The bottom tab bar: a floating brand-brown pill with white icons, lifted
 * off the content behind it.
 *
 * Icons only — the design shows no text labels — so each control carries an
 * accessibility label instead.
 */
export function BottomNavBar({ items = NAV_ITEMS, activeKey, onSelect }: BottomNavBarProps) {
  const { colors, radii } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 12) }]}>
      <View
        style={[
          styles.bar,
          { backgroundColor: colors.primary, height: BAR_HEIGHT, borderRadius: radii.pill },
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
                color={active ? colors.onPrimary : `${colors.onPrimary}99`}
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
    left: SIDE_MARGIN,
    right: SIDE_MARGIN,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
