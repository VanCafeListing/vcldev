import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AmenityBadge, Button, Card, Icon, Logo, TextInput } from '@/components/ui';
import { amber, brown, figma, neutral, useTheme } from '@/theme';

/**
 * Dev-only style guide for visually checking the primitives and both colour
 * scales against `design/source/App-design.pdf`.
 *
 * Not linked from the app's navigation — open it directly at `/style-guide`.
 */
export default function StyleGuideScreen() {
  const { colors, spacing, typography, fontsLoaded } = useTheme();

  const heading = {
    color: colors.text,
    fontFamily: typography.family.black,
    fontSize: typography.size.lg,
  };
  const caption = {
    color: colors.textMuted,
    fontFamily: typography.family.regular,
    fontSize: typography.size.xs,
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.xxl }}>
        <View style={{ gap: spacing.sm }}>
          <Text style={heading}>Logo</Text>
          <View
            style={{
              backgroundColor: colors.primary,
              padding: spacing.xl,
              alignItems: 'center',
              borderRadius: 16,
            }}
          >
            <Logo width={120} color={colors.textOnBrand} />
          </View>
          <Text style={caption}>Tinted light-on-brown, as on the splash screen.</Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={heading}>Typography — Lato</Text>
          <Text style={{ ...heading, fontSize: typography.size.xxl }}>Hi, Alice!</Text>
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.lg,
            }}
          >
            Cafes near you
          </Text>
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.regular,
              fontSize: typography.size.md,
            }}
          >
            Jorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Text>
          <Text style={caption}>
            {fontsLoaded ? 'Lato loaded.' : 'Lato still loading — showing system fallback.'}
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={heading}>Buttons</Text>
          <Button label="Sign up" variant="primary" />
          <Button label="Log in" variant="secondary" />
          <Button label="Apply" variant="deep" />
          <Button label="Save" variant="neutral" />
          <Button label="Cancel" variant="outlined" />
          <Button label="Loading" variant="primary" loading />
          <Button label="Disabled" variant="primary" disabled />
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={heading}>Inputs</Text>
          <TextInput label="First Name" required placeholder="First Name" />
          <TextInput label="Email" required placeholder="you@example.com" />
          <TextInput label="Password" required secureTextEntry error="Passwords do not match" />
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={heading}>Amenity badges</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <AmenityBadge label="Outlets" verified icon={<Icon name="Outlet" size={30} />} />
            <AmenityBadge label="Wi-Fi" verified icon={<Icon name="Wifi" size={26} />} />
            <AmenityBadge label="seats" count="20+" />
          </View>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={heading}>Card</Text>
          <Card style={{ padding: spacing.lg }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.bold,
                fontSize: typography.size.lg,
              }}
            >
              Tealips Cafe
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: typography.family.regular,
                fontSize: typography.size.sm,
              }}
            >
              6125 Sussex Ave #110, Burnaby, BC
            </Text>
          </Card>
        </View>

        <Swatches
          title="Beer Glazed Bacon — shades"
          entries={[
            ['base', brown.base],
            ...Object.entries(brown.shade).map(([k, v]) => [`${k}%`, v] as const),
          ]}
        />
        <Swatches
          title="Beer Glazed Bacon — tints"
          entries={[
            ['base', brown.base],
            ...Object.entries(brown.tint).map(([k, v]) => [`${k}%`, v] as const),
          ]}
        />
        <Swatches title="Amber accent" entries={Object.entries(amber)} />
        <Swatches title="From the Figma frames" entries={Object.entries(figma)} />
        <Swatches title="Neutrals" entries={Object.entries(neutral)} />

        <View style={{ gap: spacing.md }}>
          <Text style={heading}>Icons (exported from the PDF / Figma)</Text>
          <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
            <Icon name="TabHome" size={32} color={colors.primary} />
            <Icon name="TabSearch" size={32} color={colors.primary} />
            <Icon name="TabMap" size={32} color={colors.primary} />
            <Icon name="TabUser" size={32} color={colors.primary} />
            <Icon name="Heart" size={24} color={colors.text} />
            <Icon name="HeartFilled" size={24} color={colors.favourite} />
            <Icon name="DotsFilled" size={24} color={colors.text} />
            <Icon name="LocationPin" size={20} color={colors.primary} />
            <Icon name="Outlet" size={24} color={colors.text} />
            <Icon name="Wifi" size={24} color={colors.text} />
            <Icon name="Checkmark" size={20} color={colors.text} />
            <Icon name="Notification" size={24} color={colors.text} />
            <Icon name="Privacy" size={24} color={colors.text} />
            <Icon name="Terms" size={24} color={colors.text} />
            <Icon name="LogOut" size={24} color={colors.text} />
            <Icon name="Delete" size={24} color={colors.text} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Swatches({
  title,
  entries,
}: {
  title: string;
  entries: readonly (readonly [string, string])[];
}) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={{ gap: spacing.sm }}>
      <Text
        style={{
          color: colors.text,
          fontFamily: typography.family.black,
          fontSize: typography.size.lg,
        }}
      >
        {title}
      </Text>
      <View style={styles.swatchRow}>
        {entries.map(([name, value]) => (
          <View key={`${name}-${value}`} style={styles.swatch}>
            <View style={[styles.chip, { backgroundColor: value, borderColor: colors.border }]} />
            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.regular,
                fontSize: 10,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: typography.family.regular,
                fontSize: 9,
              }}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  swatch: { alignItems: 'center', width: 64, gap: 2 },
  chip: { width: 56, height: 40, borderRadius: 6, borderWidth: StyleSheet.hairlineWidth },
});
