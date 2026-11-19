import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeMode } from '@/types/models';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const OPTIONS: { mode: ThemeMode; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { mode: 'dark', label: uk.theme.dark, icon: 'moon' },
  { mode: 'light', label: uk.theme.light, icon: 'sun' },
  { mode: 'system', label: uk.theme.system, icon: 'smartphone' },
];

export function ThemeSelector({ visible, onClose }: Props) {
  const { colors, themeMode, setThemeMode } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.elevated, borderColor: colors.border },
          ]}>
          <Text style={[styles.title, { color: colors.text }]}>{uk.theme.title}</Text>
          <View style={styles.row}>
            {OPTIONS.map((opt) => {
              const active = themeMode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => {
                    setThemeMode(opt.mode);
                    onClose();
                  }}
                  style={[
                    styles.option,
                    {
                      borderColor: active ? colors.accent : colors.border,
                      backgroundColor: active ? colors.accentDim : colors.surface,
                    },
                  ]}>
                  <Feather
                    name={opt.icon}
                    size={18}
                    color={active ? colors.accent : colors.secondary}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: active ? colors.text : colors.secondary },
                    ]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function ThemeButton({ onPress }: { onPress: () => void }) {
  const { colors, themeMode, isDark } = useTheme();
  const icon =
    themeMode === 'system' ? 'smartphone' : isDark ? 'moon' : 'sun';

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={uk.theme.title}
      style={[styles.iconBtn, { borderColor: colors.border }]}>
      <Feather name={icon} size={18} color={colors.secondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
