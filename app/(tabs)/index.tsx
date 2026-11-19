import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CaptureInput } from '@/components/CaptureInput';
import { IdeaRow } from '@/components/IdeaRow';
import { ThemeButton, ThemeSelector } from '@/components/ThemeSelector';
import { TriageSheet } from '@/components/TriageSheet';
import { spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';
import { useAppStore } from '@/store/useAppStore';
import type { ConvertIdeaPayload, Idea } from '@/types/models';

export default function InboxScreen() {
  const { colors } = useTheme();
  const ideas = useAppStore((s) => s.ideas);
  const categories = useAppStore((s) => s.categories);
  const addIdea = useAppStore((s) => s.addIdea);
  const deleteIdea = useAppStore((s) => s.deleteIdea);
  const convertIdea = useAppStore((s) => s.convertIdea);
  const [triageTarget, setTriageTarget] = useState<Idea | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);

  const onConvert = (payload: ConvertIdeaPayload) => {
    if (!triageTarget) return;
    convertIdea(triageTarget.id, payload);
    setTriageTarget(null);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>{uk.inbox.title}</Text>
          <Text style={[styles.count, { color: colors.secondary }]}>{ideas.length}</Text>
        </View>
        <ThemeButton onPress={() => setThemeOpen(true)} />
      </View>

      <CaptureInput onSubmit={addIdea} />

      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.secondary }]}>
            {uk.inbox.empty}
          </Text>
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
        categories={categories}
        onClose={() => setTriageTarget(null)}
        onConvert={onConvert}
      />
      <ThemeSelector visible={themeOpen} onClose={() => setThemeOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  count: {
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
    fontSize: 15,
    textAlign: 'center',
    marginTop: 48,
  },
});
