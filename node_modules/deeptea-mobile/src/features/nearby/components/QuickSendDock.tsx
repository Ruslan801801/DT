import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

type Props = {
  visible: boolean;
  receiver: any;
  onClose: () => void;
  onSend: (amount: number, message?: string) => void;
};

const PRESETS = [50, 100, 200, 500];

export const QuickSendDock: React.FC<Props> = ({ visible, receiver, onClose, onSend }) => {
  const [amount, setAmount] = useState<number>(100);
  const [message, setMessage] = useState<string>('');

  if (!visible) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Быстрая отправка</Text>
        <Pressable onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <Text style={styles.receiver}>
        Получатель: {receiver?.displayName ?? '—'}
      </Text>

      <View style={styles.row}>
        {PRESETS.map((p) => (
          <Pressable
            key={p}
            style={[styles.preset, amount === p && styles.presetActive]}
            onPress={() => setAmount(p)}
          >
            <Text style={styles.presetText}>{p}₽</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Сообщение (опционально)"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
        maxLength={140}
      />

      <Pressable onPress={() => onSend(amount, message)} style={styles.primary}>
        <Text style={styles.primaryText}>🚀 Отправить {amount}₽</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700' },
  close: { fontSize: 18, opacity: 0.6 },
  receiver: { marginTop: 6, fontSize: 11, opacity: 0.7 },
  row: { marginTop: 10, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  preset: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  presetActive: {},
  presetText: { fontSize: 12, fontWeight: '600' },
  input: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    fontSize: 12,
  },
  primary: { marginTop: 10, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryText: { fontSize: 13, fontWeight: '700' },
});