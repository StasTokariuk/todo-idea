import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';
import { CATEGORY_PACKAGES } from '@/store/useAppStore';
import type { Category, ConvertIdeaPayload, Idea } from '@/types/models';

type Props = {
  visible: boolean;
  idea: Idea | null;
  categories: Category[];
  onClose: () => void;
  onConvert: (payload: ConvertIdeaPayload) => void;
};

export function TriageSheet({
  visible,
  idea,
  categories,
  onClose,
  onConvert,
}: Props) {
  const { colors } = useTheme();
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [subtitle, setSubtitle] = useState('');
  const [notes, setNotes] = useState('');
  const [useDeadline, setUseDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    if (visible) {
      setCategoryId(categories[0]?.id || '');
      setSubtitle('');
      setNotes('');
      setUseDeadline(false);
      setDeadline('');
      setLink('');
    }
  }, [visible, idea?.id, categories]);

  const submit = () => {
    const selected = categories.find((c) => c.id === categoryId);
    const isPackages =
      categoryId === CATEGORY_PACKAGES ||
      selected?.name === uk.defaults.packages;
    onConvert({
      categoryId: categoryId || '',
      subtitle,
      description: notes,
      deadline: useDeadline && deadline ? new Date(deadline).toISOString() : null,
      externalLink: link,
      hasCustomToggle: isPackages,
      customToggleLabel: isPackages ? uk.defaults.arrivedToggle : '',
      isCustomToggleChecked: false,
      status: isPackages ? 'ordered' : 'pending',
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.55)' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.elevated, borderColor: colors.border },
          ]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.kicker, { color: colors.secondary }]}>
            {uk.triage.kicker}
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>{idea?.text}</Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scroll}>
            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.triage.category}
            </Text>
            <View style={styles.chips}>
              {categories.map((cat) => {
                const active = cat.id === categoryId;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategoryId(cat.id)}
                    style={[
                      styles.chip,
                      {
                        borderColor: active ? cat.accentColor : colors.border,
                        backgroundColor: active
                          ? `${cat.accentColor}22`
                          : colors.surface,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.chipText,
                        { color: active ? colors.text : colors.secondary },
                      ]}>
                      {cat.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.triage.subtitle}
            </Text>
            <TextInput
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder={uk.triage.subtitlePlaceholder}
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                { color: colors.text, borderBottomColor: colors.border },
              ]}
            />

            <View style={styles.switchRow}>
              <Text style={[styles.labelInline, { color: colors.secondary }]}>
                {uk.triage.deadline}
              </Text>
              <Switch
                value={useDeadline}
                onValueChange={setUseDeadline}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#F4F7FB"
              />
            </View>
            {useDeadline ? (
              <TextInput
                value={deadline}
                onChangeText={setDeadline}
                placeholder={uk.triage.deadlinePlaceholder}
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                style={[
                  styles.input,
                  { color: colors.text, borderBottomColor: colors.border },
                ]}
              />
            ) : null}

            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.triage.notes}
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={uk.triage.notesPlaceholder}
              placeholderTextColor={colors.muted}
              multiline
              style={[
                styles.notes,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            />

            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.triage.link}
            </Text>
            <TextInput
              value={link}
              onChangeText={setLink}
              placeholder={uk.triage.linkPlaceholder}
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={[
                styles.input,
                { color: colors.text, borderBottomColor: colors.border },
              ]}
            />
          </ScrollView>

          <Pressable
            style={[styles.convert, { backgroundColor: colors.invert }]}
            onPress={submit}>
            <Text style={[styles.convertText, { color: colors.invertText }]}>
              {uk.triage.convert}
            </Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: colors.secondary }]}>
              {uk.triage.cancel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '88%',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  kicker: {
    fontSize: 13,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  scroll: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
    marginTop: 10,
  },
  labelInline: {
    fontSize: 13,
    fontWeight: '500',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  notes: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 12,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  switchRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  convert: {
    marginTop: 8,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  convertText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cancel: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 15,
  },
});
