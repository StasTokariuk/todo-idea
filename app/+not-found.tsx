import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Не знайдено', headerShown: true }} />
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Цей екран не існує.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.accent }]}>
            Назад до Вхідних
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: 15,
  },
});
