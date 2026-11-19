import { Feather } from '@expo/vector-icons';
import { ReactNode, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

import { radius } from '@/constants/theme';

export type SwipeAction = {
  key: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  backgroundColor: string;
  onPress: () => void;
};

type Props = {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  /** When true, fully opening left/right auto-runs the first action */
  autoCommit?: boolean;
};

export function SwipeableRow({
  children,
  leftActions = [],
  rightActions = [],
  autoCommit = false,
}: Props) {
  const ref = useRef<Swipeable>(null);

  const runAction = (action?: () => void) => {
    // Close first, then run on next tick so gesture state does not swallow the update.
    ref.current?.close();
    if (!action) return;
    requestAnimationFrame(() => {
      action();
    });
  };

  const renderActions = (actions: SwipeAction[], side: 'left' | 'right') => (
    <View style={styles.row}>
      {actions.map((action) => (
        <RectButton
          key={action.key}
          onPress={() => runAction(action.onPress)}
          style={[
            styles.action,
            {
              backgroundColor: action.backgroundColor,
              marginLeft: side === 'right' ? 8 : 0,
              marginRight: side === 'left' ? 8 : 0,
            },
          ]}>
          <Feather name={action.icon} size={18} color={action.color} />
          <Text style={[styles.label, { color: action.color }]}>{action.label}</Text>
        </RectButton>
      ))}
    </View>
  );

  return (
    <Swipeable
      ref={ref}
      friction={2}
      overshootFriction={8}
      leftThreshold={64}
      rightThreshold={64}
      overshootLeft={false}
      overshootRight={false}
      enableTrackpadTwoFingerGesture
      onSwipeableOpen={(direction) => {
        if (!autoCommit) return;
        if (direction === 'left' && leftActions[0]) {
          runAction(leftActions[0].onPress);
        }
        if (direction === 'right' && rightActions[0]) {
          // With multiple right actions, auto-commit first (archive) only when requested.
          runAction(rightActions[0].onPress);
        }
      }}
      renderLeftActions={
        leftActions.length ? () => renderActions(leftActions, 'left') : undefined
      }
      renderRightActions={
        rightActions.length ? () => renderActions(rightActions, 'right') : undefined
      }>
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  action: {
    width: 88,
    marginVertical: 6,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
