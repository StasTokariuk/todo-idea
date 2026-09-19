import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwipeableRow } from '@/components/SwipeableRow';
import { colors, radius, spacing } from '@/constants/theme';
import { formatRelativeTime } from '@/lib/time';
import type { Idea } from '@/types/models';

type Props = {
  idea: Idea;
  onTriage: () => void;
  onDelete: () => void;
};

export function IdeaRow({ idea, onTriage, onDelete }: Props) {
  return (
    <SwipeableRow onSwipeRight={onTriage} onSwipeLeft={onDelete}>
      <Pressable
        onPress={onTriage}
        accessibilityRole="button"
        accessibilityLabel={`Triage idea: ${idea.text}`}
        style={styles.row}>
        <View style={styles.dot} />
        <View style={styles.body}>
          <Text style={styles.text}>{idea.text}</Text>
          <Text style={styles.meta}>{formatRelativeTime(idea.createdAt)}</Text>
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
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.muted,
    marginTop: 7,
  },
  body: {
    flex: 1,
  },
  text: {
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
});
