import { Feather } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { SwipeableRow } from '@/components/SwipeableRow';
import { radius, spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';
import { formatDeadline, formatRelativeTime, isOverdue } from '@/lib/time';
import type { Category, Task } from '@/types/models';

type Props = {
  task: Task;
  category?: Category;
  onPress: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onToggleCustom?: (checked: boolean) => void;
};

export function TaskRow({
  task,
  category,
  onPress,
  onArchive,
  onDelete,
  onToggleCustom,
}: Props) {
  const { colors } = useTheme();
  const accent = category?.accentColor || colors.accent;
  const highlighted = task.hasCustomToggle && task.isCustomToggleChecked;
  const overdue = !task.isArchived && isOverdue(task.deadline);
  const deadlineLabel = formatDeadline(task.deadline);

  return (
    <SwipeableRow
      rightActions={[
        {
          key: 'archive',
          label: uk.swipe.archive,
          icon: 'archive',
          color: colors.archive,
          backgroundColor: colors.archiveBg,
          onPress: onArchive,
        },
        {
          key: 'delete',
          label: uk.swipe.delete,
          icon: 'trash-2',
          color: colors.danger,
          backgroundColor: colors.dangerBg,
          onPress: onDelete,
        },
      ]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={task.title}
        style={[
          styles.row,
          {
            backgroundColor: highlighted ? colors.accentDim : colors.surface,
            borderColor: highlighted ? accent : colors.border,
          },
        ]}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: highlighted ? accent : colors.muted,
              ...(highlighted
                ? Platform.select({
                    web: { boxShadow: `0 0 10px ${accent}` },
                    ios: {
                      shadowColor: accent,
                      shadowOpacity: 0.9,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 0 },
                    },
                    android: { elevation: 6 },
                    default: {},
                  })
                : null),
            },
          ]}
        />

        <View style={styles.body}>
          <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
          {task.subtitle ? (
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
              {task.subtitle}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.secondary }]}>
              {deadlineLabel
                ? deadlineLabel
                : formatRelativeTime(task.createdAt)}
            </Text>
            {overdue ? (
              <Text style={[styles.overdue, { color: colors.overdue }]}>
                {uk.task.overdue}
              </Text>
            ) : null}
          </View>

          {task.externalLink ? (
            <View style={styles.linkRow}>
              <Feather name="link" size={12} color={accent} />
              <Text style={[styles.link, { color: accent }]} numberOfLines={1}>
                {task.externalLink}
              </Text>
            </View>
          ) : null}

          {task.hasCustomToggle && onToggleCustom ? (
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: colors.secondary }]}>
                {task.customToggleLabel || uk.task.customToggle}
              </Text>
              <Switch
                value={task.isCustomToggleChecked}
                onValueChange={onToggleCustom}
                trackColor={{ false: colors.border, true: accent }}
                thumbColor={task.isCustomToggleChecked ? '#F4F7FB' : '#888'}
                ios_backgroundColor={colors.border}
              />
            </View>
          ) : null}
        </View>
      </Pressable>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 18,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meta: {
    fontSize: 13,
  },
  overdue: {
    fontSize: 12,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  link: {
    flex: 1,
    fontSize: 13,
  },
  toggleRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
