import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  quality: 'excellent' | 'good' | 'medium' | 'weak';
  rssi?: number;
  live?: boolean;
};

const LABEL: Record<Props['quality'], string> = {
  excellent: 'Отличный',
  good: 'Хороший',
  medium: 'Средний',
  weak: 'Слабый',
};

export const SignalPill: React.FC<Props> = ({ quality, rssi, live }) => {
  const label = LABEL[quality];
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>
        📶 {label}{typeof rssi === 'number' ? ` (${rssi} dBm)` : ''}{live ? ' • LIVE' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  text: { fontSize: 10, fontWeight: '600' },
});