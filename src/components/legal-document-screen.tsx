import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { LegalDocument } from '@/content/legal';
import { useTheme } from '@/theme';

/**
 * Renders a `LegalDocument` from `@/content/legal`. Shared by every legal
 * screen so the documents cannot drift in appearance, and so a wording
 * revision touches only the content module.
 */
export function LegalDocumentScreen({ document }: { document: LegalDocument }) {
  const { colors, spacing, typography } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Back"
        hitSlop={8}
        style={{ paddingHorizontal: spacing.xl, paddingVertical: spacing.md }}
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.bold,
            fontSize: typography.size.md,
          }}
        >
          ‹ Back
        </Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          // Clears the floating tab bar so the end of the document is
          // actually reachable rather than sitting behind it.
          paddingBottom: spacing.xxxl + 90,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.black,
            fontSize: typography.size.xxl,
          }}
        >
          {document.title}
        </Text>

        <Text
          style={{
            color: colors.textMuted,
            fontFamily: typography.family.regular,
            fontSize: typography.size.sm,
            marginTop: spacing.xs,
          }}
        >
          Version {document.version} · Effective {document.effectiveDate}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontFamily: typography.family.regular,
            fontSize: typography.size.md,
            lineHeight: 24,
            marginTop: spacing.lg,
          }}
        >
          {document.intro}
        </Text>

        {document.sections.map((section) => (
          <View key={section.heading} style={{ marginTop: spacing.xl }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: typography.family.bold,
                fontSize: typography.size.md,
              }}
            >
              {section.heading}
            </Text>
            {section.paragraphs.map((paragraph, index) => (
              <Text
                key={index}
                style={{
                  color: colors.text,
                  fontFamily: typography.family.regular,
                  fontSize: typography.size.md,
                  lineHeight: 24,
                  marginTop: spacing.sm,
                }}
              >
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
