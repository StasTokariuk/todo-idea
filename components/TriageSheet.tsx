import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { Idea, TaskType } from '@/types/models';

type Props = {
  visible: boolean;
  idea: Idea | null;
  onClose: () => void;
  onConvert: (type: TaskType, externalLink?: string) => void;
};

const TYPES: { key: TaskType; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'study', label: 'Study' },
  { key: 'package', label: 'Package' },
];

export function TriageSheet({ visible, idea, onClose, onConvert }: Props) {
  const [type, setType] = useState<TaskType>('general');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (visible) {
      setType('general');
      setLink('');
    }
  }, [visible, idea?.id]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.kicker}>Convert to task</Text>
          <Text style={styles.title}>{idea?.text}</Text>

          <Text style={styles.label}>Type</Text>
          <View style={styles.toggleRow}>
            {TYPES.map((item) => {
              const active = item.key === type;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => setType(item.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[styles.toggle, active && styles.toggleActive]}>
                  <Text style={[styles.toggleText, active && styles.toggleTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {type === 'study' ? (
            <TextInput
              value={link}
              onChangeText={setLink}
              placeholder="Notion or study link"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={styles.input}
            />
          ) : null}

          {type === 'package' ? (
            <Text style={styles.hint}>This will be marked as Ordered.</Text>
          ) : null}

          <Pressable
            style={styles.convert}
            accessibilityRole="button"
            onPress={() => onConvert(type, link)}>
            <Text style={styles.convertText}>Convert</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.elevated,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    flexGrow: 0,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2A2A2A',
    marginBottom: spacing.lg,
  },
  kicker: {
    color: colors.secondary,
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.secondary,
    fontSize: 13,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  toggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.elevated,
  },
  toggleActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  toggleText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.text,
  },
  input: {
    color: colors.text,
    fontSize: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  hint: {
    color: colors.secondary,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  convert: {
    marginTop: 8,
    backgroundColor: colors.text,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  convertText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  cancel: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    color: colors.secondary,
    fontSize: 15,
  },
});
