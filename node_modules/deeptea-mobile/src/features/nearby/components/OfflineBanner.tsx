import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  pendingCount: number;
  onSyncPress?: () => void;
};

export const OfflineBanner: React.FC<Props> = ({ pendingCount, onSyncPress }) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>📴 Офлайн режим</Text>
      <Text style={styles.text}>
        Нет интернета — BLE работает. Можно отправлять ваучеры.
      </Text>
      <View style={styles.row}>
        <Text style={styles.count}>Офлайн-ваучеры: {pendingCount}</Text>
        <Pressable onPress={onSyncPress} style={styles.btn}>
          <Text style={styles.btnText}>🔄 Синхронизировать</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
  },
  title: { fontSize: 14, fontWeight: '700' },
  text: { marginTop: 4, fontSize: 12, opacity: 0.8 },
  row: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  count: { fontSize: 11, opacity: 0.7 },
  btn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  btnText: { fontSize: 11, fontWeight: '600' },
});