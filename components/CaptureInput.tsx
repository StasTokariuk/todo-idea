import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

type Props = {
  onSubmit: (text: string) => void;
  autoFocus?: boolean;
};

export function CaptureInput({ onSubmit, autoFocus = true }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<TextInput>(null);

  const submit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={setValue}
        placeholder="Capture an idea…"
        placeholderTextColor={colors.muted}
        autoFocus={autoFocus}
        returnKeyType="done"
        blurOnSubmit={false}
        onSubmitEditing={submit}
        style={styles.input}
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
    borderBottomColor: colors.border,
  },
  input: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    paddingVertical: 18,
    letterSpacing: -0.3,
  },
});
