import { Modal, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import { Button, type ButtonVariant } from './button';

type ConfirmDialogProps = {
  visible: boolean;
  message: string;
  confirmLabel: string;
  /** The PDF's dialogs use the same dark charcoal for both Delete and Logout — no destructive red in this design. */
  confirmVariant?: ButtonVariant;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * The PDF's "Do you want to delete this account?" / "...log-out..." dialogs:
 * a centred white rounded card over a dimmed background, bold question text,
 * an outlined Cancel and a filled confirm button side by side.
 */
export function ConfirmDialog({
  visible,
  message,
  confirmLabel,
  confirmVariant = 'neutral',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const { colors, radii, spacing, typography } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.backdrop, { padding: spacing.xl }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderRadius: radii.xl, padding: spacing.xl, gap: spacing.xl },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: typography.family.bold,
              fontSize: typography.size.lg,
              textAlign: 'center',
            }}
          >
            {message}
          </Text>
          <View style={[styles.row, { gap: spacing.md }]}>
            <Button label="Cancel" variant="outlined" onPress={onCancel} style={styles.flexButton} />
            <Button
              label={confirmLabel}
              variant={confirmVariant}
              onPress={onConfirm}
              style={styles.flexButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
  },
  row: {
    flexDirection: 'row',
  },
  flexButton: {
    flex: 1,
  },
});
