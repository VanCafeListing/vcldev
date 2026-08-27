import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/theme';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Filters sheet: rounded-rect (radius 10). Search's recent-search row: fully pill. */
  pill?: boolean;
  selectedBackground?: string;
  selectedTextColor?: string;
};

/**
 * A selectable chip. Two shapes share this component because the two
 * sources that draw chips disagree: the PDF's Filters sheet uses a
 * rounded-rect (radius ~10) with a muted-amber selected fill and black
 * text, while Search's recent-search row (Figma-only) draws full pills with
 * a brighter accent fill and white text.
 */
export function Chip({
  label,
  selected,
  onPress,
  pill = false,
  selectedBackground,
  selectedTextColor,
}: ChipProps) {
  const { colors, radii, spacing, typography } = useTheme();

  const background = selected ? (selectedBackground ?? colors.filterChipSelected) : colors.surface;
  const textColor = selected ? (selectedTextColor ?? colors.onFilterChipSelected) : colors.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        backgroundColor: background,
        borderRadius: pill ? radii.pill : radii.md,
        borderWidth: selected ? 0 : StyleSheet.hairlineWidth * 2,
        borderColor: colors.border,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          color: textColor,
          fontFamily: typography.family.regular,
          fontSize: typography.size.md,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
