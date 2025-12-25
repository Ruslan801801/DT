import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SignalPill } from './SignalPill';

type Device = {
  id: string;
  displayName: string;
  category?: string;
  tagline?: string;
  rssi?: number;
  quality?: 'excellent' | 'good' | 'medium' | 'weak';
  lastSeenSec?: number;
};

type Props = {
  device: Device;
  onQuickAmount?: (amount: number) => void;
  onSend?: () => void;
};

const PRESETS = [50, 100, 200, 500];

export const DeviceCard: React.FC<Props> = ({ device, onQuickAmount, onSend }) => {
  const quality = device.quality ?? 'good';
  const live = (device.lastSeenSec ?? 999) < 3;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>👤 {device.displayName}</Text>
        {device.category && <Text style={styles.category}>{device.category}</Text>}
      </View>

      {device.tagline && <Text style={styles.tagline}>💬 “{device.tagline}”</Text>}

      <SignalPill quality={quality} rssi={device.rssi} live={live} />

      <View style={styles.presetsRow}>
        {PRESETS.map((a) => (
          <Pressable
            key={a}
            onPress={() => onQuickAmount?.(a)}
            style={styles.presetBtn}
          >
            <Text style={styles.presetText}>{a}₽</Text>
          </Pressable>
        ))}
        <Pressable onPress={onSend} style={styles.moreBtn}>
          <Text style={styles.moreText}>Своя сумма</Text>
        </Pressable>
      </View>

      <Pressable onPress={onSend} style={styles.primary}>
        <Text style={styles.primaryText}>🎁 Отправить</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 16,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700' },
  category: { fontSize: 11, opacity: 0.7 },
  tagline: { marginTop: 6, fontSize: 12, opacity: 0.85 },
  presetsRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  presetBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  presetText: { fontSize: 12, fontWeight: '600' },
  moreBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  moreText: { fontSize: 11, fontWeight: '600', opacity: 0.8 },
  primary: { marginTop: 10, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  primaryText: { fontSize: 13, fontWeight: '700' },
});