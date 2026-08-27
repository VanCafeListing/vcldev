import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Chip, RangeSlider } from '@/components/ui';
import { useFilters } from '@/lib/filters-context';
import { EMPTY_CRITERIA, PRICE_MAX, PRICE_MIN, type FilterCriteria } from '@/lib/filters';
import { useTheme } from '@/theme';

/**
 * The Filters sheet — PDF artboard. Not a true bottom-sheet modal: the root
 * layout has no Stack navigator (matching the rest of the app's routes, e.g.
 * the Cafe detail push), so this renders as a full screen rather than
 * sliding up over a dimmed background.
 *
 * Only "Apply" commits changes to `FiltersProvider`; closing via ✕ discards
 * this screen's local draft, so reopening Filters always shows the
 * last-applied state, never an abandoned in-progress edit.
 */
export default function FiltersScreen() {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();
  const { criteria: applied, apply } = useFilters();

  const [draft, setDraft] = useState<FilterCriteria>(applied);

  function toggle<K extends keyof FilterCriteria>(key: K) {
    setDraft((d) => ({ ...d, [key]: !d[key] }));
  }

  function onApply() {
    apply(draft);
    router.back();
  }

  function onClearAll() {
    setDraft(EMPTY_CRITERIA);
  }

  const sectionLabel = {
    color: colors.text,
    fontFamily: typography.family.regular,
    fontSize: typography.size.md,
    marginBottom: spacing.md,
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.xl, paddingTop: spacing.md }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          style={[styles.closeButton, { backgroundColor: colors.placeholder }]}
        >
          <Text style={{ color: colors.text, fontSize: typography.size.lg }}>✕</Text>
        </Pressable>

        <Text
          style={{ color: colors.text, fontFamily: typography.family.bold, fontSize: typography.size.xl }}
        >
          Filters
        </Text>

        <Pressable onPress={onClearAll} accessibilityRole="button" hitSlop={8}>
          <Text
            style={{ color: colors.text, fontFamily: typography.family.regular, fontSize: typography.size.md }}
          >
            Clear all
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxxl }}>
        <Text style={sectionLabel}>Location</Text>
        <View style={[styles.chipRow, { gap: spacing.md, marginBottom: spacing.xl }]}>
          {/* "Nearest" is cosmetic — the mockup draws no alternate sort for it
              to toggle between, so it's always shown selected. */}
          <Chip label="Nearest" selected onPress={() => {}} />
          <Chip
            label="Commuter Friendly"
            selected={Boolean(draft.commuterFriendly)}
            onPress={() => toggle('commuterFriendly')}
          />
          <Chip
            label="Easy Parking"
            selected={Boolean(draft.easyParking)}
            onPress={() => toggle('easyParking')}
          />
        </View>

        <Text style={sectionLabel}>Workspace Essentials</Text>
        <View style={[styles.chipRow, { gap: spacing.md, marginBottom: spacing.xl }]}>
          <Chip label="Free Wi-Fi" selected={Boolean(draft.wifi)} onPress={() => toggle('wifi')} />
          <Chip label="Outlets" selected={Boolean(draft.outlets)} onPress={() => toggle('outlets')} />
        </View>

        <Text style={sectionLabel}>Price Range</Text>
        <View style={{ marginBottom: spacing.xl }}>
          <RangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            valueMin={draft.minPrice ?? PRICE_MIN}
            valueMax={draft.maxPrice ?? PRICE_MAX}
            onChange={(minPrice, maxPrice) => setDraft((d) => ({ ...d, minPrice, maxPrice }))}
          />
          <View style={[styles.priceLabels, { marginTop: spacing.sm }]}>
            <Text style={{ color: colors.text, fontFamily: typography.family.regular, fontSize: typography.size.sm }}>
              ${PRICE_MIN}
            </Text>
            <Text style={{ color: colors.text, fontFamily: typography.family.regular, fontSize: typography.size.sm }}>
              ${PRICE_MAX}
            </Text>
          </View>
        </View>

        <Text style={sectionLabel}>Seating</Text>
        <View style={[styles.chipRow, { gap: spacing.md, marginBottom: spacing.xl }]}>
          <Chip
            label="Spacious"
            selected={Boolean(draft.seatingSpacious)}
            onPress={() => toggle('seatingSpacious')}
          />
          <Chip
            label="Wide Tables"
            selected={Boolean(draft.seatingWideTables)}
            onPress={() => toggle('seatingWideTables')}
          />
          <Chip
            label="Patio Seating"
            selected={Boolean(draft.seatingPatio)}
            onPress={() => toggle('seatingPatio')}
          />
        </View>

        <Text style={sectionLabel}>Atmosphere</Text>
        <View style={[styles.chipRow, { gap: spacing.md, marginBottom: spacing.xxl }]}>
          <Chip
            label="Quiet"
            selected={Boolean(draft.atmosphereQuiet)}
            onPress={() => toggle('atmosphereQuiet')}
          />
          <Chip
            label="Lively"
            selected={Boolean(draft.atmosphereLively)}
            onPress={() => toggle('atmosphereLively')}
          />
        </View>

        <Button label="Apply" variant="deep" onPress={onApply} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
