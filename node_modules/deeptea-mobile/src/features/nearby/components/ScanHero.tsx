import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  deviceCount: number;
  isScanning?: boolean;
  onToggleScan?: () => void;
};

export const ScanHero: React.FC<Props> = ({
  deviceCount,
  isScanning = true,
  onToggleScan,
}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.radar}>
        <Text style={styles.radarText}>
          {isScanning ? 'ＢＬＥ\nСКАНИРОВАНИЕ' : 'СКАНИРОВАНИЕ\nПАУЗА'}
        </Text>
        <Text style={styles.radarSub}>
          {isScanning ? 'Ищем…' : 'Нажмите, чтобы продолжить'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.count}>Найдено: {deviceCount}</Text>
        <Pressable onPress={onToggleScan} style={styles.btn}>
          <Text style={styles.btnText}>{isScanning ? '⏸️ Пауза' : '▶️ Старт'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingBottom: 8 },
  radar: {
    height: 160,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarText: { textAlign: 'center', fontSize: 22, fontWeight: '700' },
  radarSub: { marginTop: 8, fontSize: 12, opacity: 0.7 },
  row: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: { fontSize: 12, opacity: 0.7 },
  btn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  btnText: { fontSize: 12, fontWeight: '600' },
});