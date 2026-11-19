import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwipeableRow } from '@/components/SwipeableRow';
import { radius, spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';
import { formatRelativeTime } from '@/lib/time';
import type { Idea } from '@/types/models';

type Props = {
  idea: Idea;
  onTriage: () => void;
  onDelete: () => void;
};

export function IdeaRow({ idea, onTriage, onDelete }: Props) {
  const { colors } = useTheme();

  return (
    <SwipeableRow
      autoCommit
      leftActions={[
        {
          key: 'triage',
          label: uk.swipe.triage,
          icon: 'corner-up-right',
          color: colors.accent,
          backgroundColor: colors.archiveBg,
          onPress: onTriage,
        },
      ]}
      rightActions={[
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
        onPress={onTriage}
        accessibilityRole="button"
        accessibilityLabel={`${uk.inbox.triageA11y}: ${idea.text}`}
        style={[
          styles.row,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}>
        <View style={[styles.dot, { backgroundColor: colors.muted }]} />
        <View style={styles.body}>
          <Text style={[styles.text, { color: colors.text }]}>{idea.text}</Text>
          <Text style={[styles.meta, { color: colors.secondary }]}>
            {formatRelativeTime(idea.createdAt)}
          </Text>
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
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 7,
  },
  body: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
  },
});
