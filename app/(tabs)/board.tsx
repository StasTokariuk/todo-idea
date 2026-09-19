import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskRow } from '@/components/TaskRow';
import { colors, spacing } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import type { Task, TaskType } from '@/types/models';

const SECTIONS: { type: TaskType; title: string }[] = [
  { type: 'general', title: 'General' },
  { type: 'study', title: 'Study' },
  { type: 'package', title: 'Packages' },
];

export default function BoardScreen() {
  const tasks = useAppStore((state) => state.tasks);
  const archiveTask = useAppStore((state) => state.archiveTask);
  const setTaskStatus = useAppStore((state) => state.setTaskStatus);

  const byType = (type: TaskType) =>
    tasks.filter((task) => task.type === type && task.status !== 'completed');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Action Board</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {SECTIONS.map((section) => {
          const items = byType(section.type);
          return (
            <View key={section.type} style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionCount}>{items.length}</Text>
              </View>
              {items.length === 0 ? (
                <Text style={styles.empty}>Clear</Text>
              ) : (
                items.map((task: Task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onArchive={() => archiveTask(task.id)}
                    onToggleArrived={
                      task.type === 'package'
                        ? (arrived) =>
                            setTaskStatus(task.id, arrived ? 'arrived' : 'ordered')
                        : undefined
                    }
                  />
                ))
              )}
            </View>
          );
        })}
      </ScrollView>
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
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    color: colors.muted,
    fontSize: 14,
    paddingVertical: 8,
  },
});
