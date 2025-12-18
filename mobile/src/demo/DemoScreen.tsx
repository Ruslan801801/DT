import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { demoFeed, demoHealth, demoLogin, demoReset, demoTip, DemoTip } from './api';

function is404(e: any) {
  return e && (e.status === 404 || e?.message?.includes(' 404'));
}

function demoDisabledHint(base: string) {
  return (
    'Demo endpoints disabled (404).\n\n' +
    'Enable on backend:\n' +
    '  DEMO_MODE=1\n\n' +
    'Also check Base URL:\n' +
    '  ' + base + '\n' +
    "If your server uses '/api' prefix, set:\n" +
    '  http://<host>:3000/api'
  );
}

export default function DemoScreen() {
  const [base, setBase] = useState('http://localhost:3000'); // если у тебя /api prefix: http://localhost:3000/api
  const [name, setName] = useState('Alice');
  const [token, setToken] = useState('');
  const [toName, setToName] = useState('Bob');
  const [amount, setAmount] = useState('150');
  const [message, setMessage] = useState('Thanks 🙌');
  const [tips, setTips] = useState<DemoTip[]>([]);
  const [status, setStatus] = useState<string>('');

  const canSend = useMemo(() => token.length > 0 && toName.trim().length > 0 && Number(amount) > 0, [token, toName, amount]);

  async function doHealth() {
    try {
      setStatus('checking...');
      const r = await demoHealth(base);
      setStatus(JSON.stringify(r));
    } catch (e: any) {
      setStatus('');
      if (is404(e)) {
        Alert.alert('Demo is OFF', demoDisabledHint(base));
      } else {
        Alert.alert('Health error', String(e?.message || e));
      }
    }
  }

  async function doReset() {
    try {
      await demoReset(base, true);
      await doFeed();
      Alert.alert('Demo reset', 'Seeded demo data');
    } catch (e: any) {
      if (is404(e)) Alert.alert('Demo is OFF', demoDisabledHint(base));
      else Alert.alert('Reset error', String(e?.message || e));
    }
  }

  async function doLogin() {
    try {
      const u = await demoLogin(base, name);
      setToken(u.token);
      Alert.alert('Logged in', `token saved for ${u.name}`);
    } catch (e: any) {
      if (is404(e)) Alert.alert('Demo is OFF', demoDisabledHint(base));
      else Alert.alert('Login error', String(e?.message || e));
    }
  }

  async function doSend() {
    try {
      await demoTip(base, token, toName, Number(amount), message);
      await doFeed();
      Alert.alert('Sent', 'Tip created');
    } catch (e: any) {
      if (is404(e)) Alert.alert('Demo is OFF', demoDisabledHint(base));
      else Alert.alert('Send error', String(e?.message || e));
    }
  }

  async function doFeed() {
    try {
      const f = await demoFeed(base);
      setTips(f);
    } catch (e: any) {
      if (is404(e)) Alert.alert('Demo is OFF', demoDisabledHint(base));
      else Alert.alert('Feed error', String(e?.message || e));
    }
  }

  const Btn = ({ title, onPress, disabled }: any) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        opacity: disabled ? 0.4 : 1,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text>{title}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 14 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 10 }}>DT Demo</Text>

      <Text style={{ opacity: 0.7, marginBottom: 8 }}>
        Tip: if you get 404, enable DEMO_MODE=1 on backend.
      </Text>

      <Text>API Base URL</Text>
      <TextInput
        value={base}
        onChangeText={setBase}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10 }}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Btn title="Health" onPress={doHealth} />
        <Btn title="Reset+Seed" onPress={doReset} />
        <Btn title="Feed" onPress={doFeed} />
      </View>

      {status ? (
        <Text stMD
