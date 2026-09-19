import { Feather } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { SwipeableRow } from '@/components/SwipeableRow';
import { colors, radius, spacing } from '@/constants/theme';
import { formatRelativeTime } from '@/lib/time';
import type { Task } from '@/types/models';

type Props = {
  task: Task;
  onArchive: () => void;
  onToggleArrived?: (arrived: boolean) => void;
};

export function TaskRow({ task, onArchive, onToggleArrived }: Props) {
  const arrived = task.status === 'arrived';

  return (
    <SwipeableRow
      onSwipeLeft={onArchive}
      leftLabel="Archive"
      leftIcon="archive">
      <View style={[styles.row, arrived && styles.arrivedRow]}>
        {task.type === 'package' ? (
          <View style={[styles.glowDot, arrived && styles.glowDotOn]} />
        ) : (
          <View style={styles.quietDot} />
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.meta}>
            {task.type === 'package'
              ? arrived
                ? 'Arrived'
                : 'Ordered'
              : formatRelativeTime(task.createdAt)}
          </Text>

          {task.type === 'study' && task.externalLink ? (
            <Pressable
              onPress={() => Linking.openURL(task.externalLink!)}
              style={styles.linkRow}
              hitSlop={8}>
              <Feather name="link" size={13} color={colors.accent} />
              <Text style={styles.link} numberOfLines={1}>
                {task.externalLink}
              </Text>
            </Pressable>
          ) : null}

          {task.type === 'package' && onToggleArrived ? (
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Mark as Arrived</Text>
              <Switch
                value={arrived}
                onValueChange={onToggleArrived}
                trackColor={{ false: '#222', true: colors.accent }}
                thumbColor={arrived ? '#F4F7FB' : '#888'}
                ios_backgroundColor="#222"
              />
            </View>
          ) : null}
        </View>
      </View>
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
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  arrivedRow: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  glowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginTop: 7,
  },
  glowDotOn: {
    backgroundColor: colors.accent,
    boxShadow: `0 0 10px ${colors.accent}`,
    elevation: 6,
  },
  quietDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginTop: 7,
  },
  body: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  meta: {
    marginTop: 6,
    color: colors.secondary,
    fontSize: 13,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  link: {
    flex: 1,
    color: colors.accent,
    fontSize: 13,
  },
  toggleRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
