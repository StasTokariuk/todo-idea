import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { uk } from '@/constants/uk';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  onSubmit: (text: string) => void;
  autoFocus?: boolean;
};

export function CaptureInput({ onSubmit, autoFocus = true }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<TextInput>(null);
  const { colors } = useTheme();

  const submit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <View style={[styles.wrap, { borderBottomColor: colors.border }]}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={setValue}
        placeholder={uk.inbox.capturePlaceholder}
        placeholderTextColor={colors.muted}
        autoFocus={autoFocus}
        returnKeyType="done"
        blurOnSubmit={false}
        onSubmitEditing={submit}
        style={[styles.input, { color: colors.text }]}
        multiline={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  input: {
    fontSize: 22,
    fontWeight: '600',
    paddingVertical: 18,
    letterSpacing: -0.3,
  },
});
