import { Feather } from '@expo/vector-icons';
import { ReactNode, useRef } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { colors, radius } from '@/constants/theme';

type Props = {
  children: ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightLabel?: string;
  leftLabel?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
};

export function SwipeableRow({
  children,
  onSwipeRight,
  onSwipeLeft,
  rightLabel = 'Triage',
  leftLabel = 'Delete',
  leftIcon = 'trash-2',
  rightIcon = 'corner-up-right',
}: Props) {
  const ref = useRef<Swipeable>(null);

  const closeThen = (action?: () => void) => {
    ref.current?.close();
    action?.();
  };

  return (
    <Swipeable
      ref={ref}
      friction={2}
      overshootFriction={8}
      leftThreshold={72}
      rightThreshold={72}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') closeThen(onSwipeRight);
        if (direction === 'right') closeThen(onSwipeLeft);
      }}
      renderLeftActions={
        onSwipeRight
          ? () => (
              <Pressable
                onPress={() => closeThen(onSwipeRight)}
                style={[styles.action, styles.triage]}>
                <Feather name={rightIcon} size={18} color={colors.accent} />
                <Text style={[styles.actionLabel, { color: colors.accent }]}>
                  {rightLabel}
                </Text>
              </Pressable>
            )
          : undefined
      }
      renderRightActions={
        onSwipeLeft
          ? () => (
              <Pressable
                onPress={() => closeThen(onSwipeLeft)}
                style={[styles.action, styles.delete]}>
                <Feather name={leftIcon} size={18} color={colors.danger} />
                <Text style={[styles.actionLabel, { color: colors.danger }]}>
                  {leftLabel}
                </Text>
              </Pressable>
            )
          : undefined
      }>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    width: 92,
    marginVertical: 6,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  triage: {
    backgroundColor: colors.triageBg,
    marginRight: 8,
  },
  delete: {
    backgroundColor: colors.dangerBg,
    marginLeft: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
