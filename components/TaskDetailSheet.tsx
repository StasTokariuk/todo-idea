import * as Linking from 'expo-linking';
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
import { confirmAction } from '@/lib/confirm';
import { isOverdue, toDateInputValue } from '@/lib/time';
import type { Category, Task, TaskUpdate } from '@/types/models';

type Props = {
  visible: boolean;
  task: Task | null;
  categories: Category[];
  onClose: () => void;
  onSave: (id: string, patch: TaskUpdate) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskDetailSheet({
  visible,
  task,
  categories,
  onClose,
  onSave,
  onArchive,
  onUnarchive,
  onDelete,
}: Props) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [useDeadline, setUseDeadline] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [hasCustomToggle, setHasCustomToggle] = useState(false);
  const [customToggleLabel, setCustomToggleLabel] = useState('');
  const [isCustomToggleChecked, setIsCustomToggleChecked] = useState(false);
  const [externalLink, setExternalLink] = useState('');

  useEffect(() => {
    if (visible && task) {
      setTitle(task.title);
      setSubtitle(task.subtitle);
      setDescription(task.description);
      setCategoryId(task.categoryId);
      setUseDeadline(!!task.deadline);
      setDeadline(toDateInputValue(task.deadline));
      setHasCustomToggle(task.hasCustomToggle);
      setCustomToggleLabel(task.customToggleLabel);
      setIsCustomToggleChecked(task.isCustomToggleChecked);
      setExternalLink(task.externalLink || '');
    }
  }, [visible, task]);

  // Keep modal mounted while closing after delete; avoid crashing on missing task.
  if (!task) {
    return (
      <Modal visible={false} transparent onRequestClose={onClose}>
        <View />
      </Modal>
    );
  }

  const overdue = useDeadline && isOverdue(deadline || null);

  const buildPatch = (): TaskUpdate => ({
    title: title.trim() || task.title,
    subtitle: subtitle.trim(),
    description: description.trim(),
    categoryId,
    deadline:
      useDeadline && deadline
        ? new Date(deadline).toISOString()
        : null,
    hasCustomToggle,
    customToggleLabel: hasCustomToggle ? customToggleLabel.trim() : '',
    isCustomToggleChecked: hasCustomToggle ? isCustomToggleChecked : false,
    externalLink: externalLink.trim() || undefined,
  });

  const save = () => {
    onSave(task.id, buildPatch());
    onClose();
  };

  const confirmDelete = () => {
    const taskId = task.id;
    confirmAction(uk.task.deleteConfirm, uk.task.deleteConfirmBody, {
      confirmLabel: uk.task.delete,
      cancelLabel: uk.triage.cancel,
      destructive: true,
      onConfirm: () => {
        // Close first so modal unmount does not race with store update.
        onClose();
        requestAnimationFrame(() => {
          onDelete(taskId);
        });
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.elevated, borderColor: colors.border },
          ]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.kicker, { color: colors.secondary }]}>
            {uk.task.details}
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}>
            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.task.title}
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={[
                styles.titleInput,
                { color: colors.text, borderBottomColor: colors.border },
              ]}
            />

            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.task.subtitle}
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

            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.task.description}
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
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
              {uk.task.category}
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

            <View style={styles.switchRow}>
              <Text style={[styles.labelInline, { color: colors.secondary }]}>
                {uk.task.deadline}
              </Text>
              <Switch
                value={useDeadline}
                onValueChange={setUseDeadline}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#F4F7FB"
              />
            </View>
            {useDeadline ? (
              <>
                <TextInput
                  value={deadline}
                  onChangeText={setDeadline}
                  placeholder={uk.triage.deadlinePlaceholder}
                  placeholderTextColor={colors.muted}
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    {
                      color: overdue ? colors.overdue : colors.text,
                      borderBottomColor: overdue ? colors.overdue : colors.border,
                    },
                  ]}
                />
                {overdue ? (
                  <Text style={[styles.overdue, { color: colors.overdue }]}>
                    {uk.task.overdue}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={[styles.hint, { color: colors.muted }]}>
                {uk.task.noDeadline}
              </Text>
            )}

            <View style={styles.switchRow}>
              <Text style={[styles.labelInline, { color: colors.secondary }]}>
                {uk.task.customToggle}
              </Text>
              <Switch
                value={hasCustomToggle}
                onValueChange={setHasCustomToggle}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#F4F7FB"
              />
            </View>
            {hasCustomToggle ? (
              <>
                <TextInput
                  value={customToggleLabel}
                  onChangeText={setCustomToggleLabel}
                  placeholder={uk.task.customTogglePlaceholder}
                  placeholderTextColor={colors.muted}
                  style={[
                    styles.input,
                    { color: colors.text, borderBottomColor: colors.border },
                  ]}
                />
                <View style={styles.switchRow}>
                  <Text style={[styles.labelInline, { color: colors.secondary }]}>
                    {customToggleLabel || uk.task.customToggle}
                  </Text>
                  <Switch
                    value={isCustomToggleChecked}
                    onValueChange={setIsCustomToggleChecked}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor="#F4F7FB"
                  />
                </View>
              </>
            ) : null}

            <Text style={[styles.label, { color: colors.secondary }]}>
              {uk.task.link}
            </Text>
            <TextInput
              value={externalLink}
              onChangeText={setExternalLink}
              placeholder={uk.task.linkPlaceholder}
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={[
                styles.input,
                { color: colors.text, borderBottomColor: colors.border },
              ]}
            />
            {externalLink.trim() ? (
              <Pressable
                onPress={() => Linking.openURL(externalLink.trim())}
                style={[styles.linkBtn, { borderColor: colors.border }]}>
                <Text style={[styles.linkBtnText, { color: colors.accent }]}>
                  {uk.task.openLink}
                </Text>
              </Pressable>
            ) : null}
          </ScrollView>

          <Pressable
            style={[styles.primary, { backgroundColor: colors.invert }]}
            onPress={save}>
            <Text style={[styles.primaryText, { color: colors.invertText }]}>
              {uk.task.save}
            </Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable
              style={[styles.secondary, { borderColor: colors.border }]}
              onPress={() => {
                if (task.isArchived) onUnarchive(task.id);
                else onArchive(task.id);
                onClose();
              }}>
              <Text style={[styles.secondaryText, { color: colors.accent }]}>
                {task.isArchived ? uk.task.unarchive : uk.task.archive}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.secondary, { borderColor: colors.danger }]}
              accessibilityRole="button"
              accessibilityLabel={uk.task.delete}
              onPress={confirmDelete}>
              <Text style={[styles.secondaryText, { color: colors.danger }]}>
                {uk.task.delete}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '92%',
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
    marginBottom: spacing.sm,
  },
  content: {
    paddingBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    marginTop: 12,
    marginBottom: 8,
  },
  labelInline: {
    fontSize: 13,
    fontWeight: '500',
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  notes: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
    textAlignVertical: 'top',
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
  switchRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hint: {
    marginTop: 6,
    fontSize: 13,
  },
  overdue: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  linkBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primary: {
    marginTop: 8,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  secondary: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
