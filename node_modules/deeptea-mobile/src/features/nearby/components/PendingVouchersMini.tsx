import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  count: number;
  onOpen?: () => void;
};

export const PendingVouchersMini: React.FC<Props> = ({ count, onOpen }) => {
  return (
    <Pressable onPress={onOpen} style={styles.wrap}>
      <Text style={styles.text}>📫 Ожидающие ваучеры: {count}</Text>
      <Text style={styles.link}>Открыть</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: { fontSize: 12, fontWeight: '600' },
  link: { fontSize: 11, opacity: 0.7 },
});