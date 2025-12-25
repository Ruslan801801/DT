import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HeaderBrand: React.FC = () => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>🍵 DeepTea</Text>
      <Text style={styles.subtitle}>P2P чаевые по Bluetooth</Text>
      <Text style={styles.micro}>Офлайн • Быстро • Надёжно</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { marginTop: 2, fontSize: 14 },
  micro: { marginTop: 2, fontSize: 11, opacity: 0.7 },
});