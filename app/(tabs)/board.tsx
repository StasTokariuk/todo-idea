import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryManager } from '@/components/CategoryManager';
import { TaskDetailSheet } from '@/components/TaskDetailSheet';
import { TaskRow } from '@/components/TaskRow';
import { ThemeButton, ThemeSelector } from '@/components/ThemeSelector';
import { radius, spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';
import { confirmAction } from '@/lib/confirm';
import { useAppStore } from '@/store/useAppStore';

export default function BoardScreen() {
  const { colors } = useTheme();
  const tasks = useAppStore((s) => s.tasks);
  const categories = useAppStore((s) => s.categories);
  const boardFilter = useAppStore((s) => s.boardFilter);
  const setBoardFilter = useAppStore((s) => s.setBoardFilter);
  const archiveTask = useAppStore((s) => s.archiveTask);
  const unarchiveTask = useAppStore((s) => s.unarchiveTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const setCustomToggle = useAppStore((s) => s.setCustomToggle);
  const addCategory = useAppStore((s) => s.addCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);
  const deleteCategory = useAppStore((s) => s.deleteCategory);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  const selected = selectedId
    ? tasks.find((task) => task.id === selectedId) || null
    : null;

  const categoryMap = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c]));
    return map;
  }, [categories]);

  const filtered = tasks.filter((task) =>
    boardFilter === 'archive' ? task.isArchived : !task.isArchived,
  );

  const knownCategoryIds = useMemo(
    () => new Set(categories.map((c) => c.id)),
    [categories],
  );

  const orphaned = filtered.filter(
    (task) => !task.categoryId || !knownCategoryIds.has(task.categoryId),
  );

  const sections = [
    ...categories.map((section) => ({
      id: section.id,
      name: section.name,
      accentColor: section.accentColor,
      items: filtered.filter((task) => task.categoryId === section.id),
    })),
    ...(orphaned.length
      ? [
          {
            id: '__uncategorized__',
            name: uk.categories.uncategorized,
            accentColor: colors.muted,
            items: orphaned,
          },
        ]
      : []),
  ];

  const renderTask = (task: (typeof filtered)[number]) => (
    <TaskRow
      key={task.id}
      task={task}
      category={categoryMap.get(task.categoryId)}
      onPress={() => setSelectedId(task.id)}
      onArchive={() =>
        task.isArchived ? unarchiveTask(task.id) : archiveTask(task.id)
      }
      onDelete={() => {
        confirmAction(uk.task.deleteConfirm, uk.task.deleteConfirmBody, {
          confirmLabel: uk.task.delete,
          cancelLabel: uk.triage.cancel,
          destructive: true,
          onConfirm: () => deleteTask(task.id),
        });
      }}
      onToggleCustom={
        task.hasCustomToggle
          ? (checked) => setCustomToggle(task.id, checked)
          : undefined
      }
    />
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{uk.board.title}</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setCatsOpen(true)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={uk.board.manageCategories}
            style={[styles.iconBtn, { borderColor: colors.border }]}>
            <Feather name="folder" size={16} color={colors.secondary} />
          </Pressable>
          <ThemeButton onPress={() => setThemeOpen(true)} />
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['active', 'archive'] as const).map((key) => {
          const active = boardFilter === key;
          return (
            <Pressable
              key={key}
              onPress={() => setBoardFilter(key)}
              style={[
                styles.filterChip,
                {
                  borderColor: active ? colors.accent : colors.border,
                  backgroundColor: active ? colors.accentDim : 'transparent',
                },
              ]}>
              <Text
                style={[
                  styles.filterText,
                  { color: active ? colors.text : colors.secondary },
                ]}>
                {key === 'active' ? uk.board.active : uk.board.archive}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.secondary }]}>
            {boardFilter === 'archive' ? uk.board.emptyArchive : uk.board.emptyActive}
          </Text>
        ) : (
          sections.map((section) => {
            if (section.items.length === 0 && boardFilter === 'archive') return null;
            return (
              <View key={section.id} style={styles.section}>
                <View style={styles.sectionHead}>
                  <View style={styles.sectionTitleRow}>
                    <View
                      style={[styles.sectionDot, { backgroundColor: section.accentColor }]}
                    />
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      {section.name}
                    </Text>
                  </View>
                  <Text style={[styles.sectionCount, { color: colors.secondary }]}>
                    {section.items.length}
                  </Text>
                </View>
                {section.items.length === 0 ? (
                  <Text style={[styles.emptyCat, { color: colors.muted }]}>
                    {uk.board.emptyCategory}
                  </Text>
                ) : (
                  section.items.map(renderTask)
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <TaskDetailSheet
        visible={!!selected}
        task={selected}
        categories={categories}
        onClose={() => setSelectedId(null)}
        onSave={updateTask}
        onArchive={archiveTask}
        onUnarchive={unarchiveTask}
        onDelete={deleteTask}
      />
      <CategoryManager
        visible={catsOpen}
        categories={categories}
        onClose={() => setCatsOpen(false)}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
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
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 48,
  },
  emptyCat: {
    fontSize: 14,
    paddingVertical: 8,
  },
});
