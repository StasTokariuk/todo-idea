import { useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';
import type { ThemeMode } from '@/types/models';

export function resolveScheme(
  mode: ThemeMode,
  system: ColorSchemeName,
): 'light' | 'dark' {
  if (mode === 'system') return system === 'light' ? 'light' : 'dark';
  return mode;
}

export function useTheme() {
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const [system, setSystem] = useState<ColorSchemeName>(
    () => Appearance.getColorScheme() ?? 'dark',
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const scheme = resolveScheme(themeMode, system);
  const colors: ThemeColors = scheme === 'light' ? lightColors : darkColors;

  return useMemo(
    () => ({
      colors,
      scheme,
      themeMode,
      setThemeMode,
      isDark: scheme === 'dark',
    }),
    [colors, scheme, themeMode, setThemeMode],
  );
}
