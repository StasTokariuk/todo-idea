import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CaptureInput } from '@/components/CaptureInput';
import { IdeaRow } from '@/components/IdeaRow';
import { TriageSheet } from '@/components/TriageSheet';
import { colors, spacing } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import type { Idea, TaskType } from '@/types/models';

export default function InboxScreen() {
  const ideas = useAppStore((state) => state.ideas);
  const addIdea = useAppStore((state) => state.addIdea);
  const deleteIdea = useAppStore((state) => state.deleteIdea);
  const convertIdea = useAppStore((state) => state.convertIdea);
  const [triageTarget, setTriageTarget] = useState<Idea | null>(null);

  const onConvert = (type: TaskType, externalLink?: string) => {
    if (!triageTarget) return;
    convertIdea(triageTarget.id, type, externalLink);
    setTriageTarget(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <Text style={styles.count}>{ideas.length}</Text>
      </View>

      <CaptureInput onSubmit={addIdea} />

      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>Nothing waiting. Capture something.</Text>
        }
        renderItem={({ item }) => (
          <IdeaRow
            idea={item}
            onTriage={() => setTriageTarget(item)}
            onDelete={() => deleteIdea(item.id)}
          />
        )}
      />

      <TriageSheet
        visible={!!triageTarget}
        idea={triageTarget}
        onClose={() => setTriageTarget(null)}
        onConvert={onConvert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  count: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
  },
  empty: {
    color: colors.secondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 48,
  },
});
