import { Alert, Platform } from 'react-native';

/**
 * Cross-platform confirm. Alert.alert button callbacks are unreliable on web.
 */
export function confirmAction(
  title: string,
  message: string,
  options: {
    confirmLabel: string;
    cancelLabel: string;
    destructive?: boolean;
    onConfirm: () => void;
  },
): void {
  if (Platform.OS === 'web') {
    const ok =
      typeof globalThis.confirm === 'function'
        ? globalThis.confirm(message ? `${title}\n\n${message}` : title)
        : true;
    if (ok) options.onConfirm();
    return;
  }

  Alert.alert(title, message || undefined, [
    { text: options.cancelLabel, style: 'cancel' },
    {
      text: options.confirmLabel,
      style: options.destructive ? 'destructive' : 'default',
      onPress: options.onConfirm,
    },
  ]);
}
