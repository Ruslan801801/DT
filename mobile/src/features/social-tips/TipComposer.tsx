import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image } from 'react-native';

type Props = {
  receiver: { eid: string; displayName?: string };
  user: { id: string };
  onSent?: (tip: any) => void;
};

export const TipComposer: React.FC<Props> = ({ receiver, user, onSent }) => {
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('100');
  const [anonymity, setAnonymity] = useState<0 | 1 | 2>(1);
  const [busy, setBusy] = useState(false);

  const sendTip = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const form = {
        sender_id: user.id,
        receiver_eid: receiver.eid,
        amount: Number(amount) || 0,
        message,
        anonymity_level: anonymity,
      };
      const res = await fetch(`${process.env.API_BASE_URL}/api/social-tips/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `social-${Date.now()}-${Math.random()}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      onSent?.(data);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        {receiver.displayName || 'Получатель'}
      </Text>

      <TextInput
        placeholder="Сумма, ₽"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 8 }}
      />

      <TextInput
        placeholder="Сообщение благодарности"
        value={message}
        onChangeText={setMessage}
        maxLength={140}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, minHeight: 80, marginBottom: 8 }}
        multiline
      />

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {[
          { value: 0 as 0, label: 'Анонимно' },
          { value: 1 as 1, label: 'Имя' },
          { value: 2 as 2, label: 'Имя+фото' },
        ].map(opt => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => setAnonymity(opt.value)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: anonymity === opt.value ? '#16a34a' : '#ddd',
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 12 }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={sendTip}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: busy ? '#a7f3d0' : '#22c55e',
          borderRadius: 999,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#000', fontWeight: '600' }}>
          {busy ? 'Отправляем...' : `Отправить ${amount || '0'} ₽ с благодарностью`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

---