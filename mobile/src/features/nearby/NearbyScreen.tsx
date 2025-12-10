import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { HeaderBrand } from './components/HeaderBrand';
import { ScanHero } from './components/ScanHero';
import { OfflineBanner } from './components/OfflineBanner';
import { DeviceCard } from './components/DeviceCard';
import { PendingVouchersMini } from './components/PendingVouchersMini';
import { QuickSendDock } from './components/QuickSendDock';

/**
 * NearbyScreen (Stage 1)
 * - Displays BLE scan hero + list of nearby candidates.
 * - Integrates offline banner + pending vouchers mini widget.
 * - QuickSendDock is activated when a device is selected.
 *
 * Data wiring should come from:
 * - BleService + store (Zustand)
 * - risk decision hook
 * - vouchers local state / sync service
 */
export const NearbyScreen: React.FC = () => {
  // TODO: replace with real store selectors
  const isOffline = false;
  const devices = [] as any[];
  const pendingCount = 0;
  const selected = null as any;

  const sortedDevices = useMemo(() => {
    // TODO: sort by confidence (lastSeen + rssi quality + stable appearances)
    return devices;
  }, [devices]);

  return (
    <View style={styles.container}>
      <HeaderBrand />

      {isOffline && <OfflineBanner pendingCount={pendingCount} />}

      <ScanHero deviceCount={sortedDevices.length} />

      {pendingCount > 0 && !isOffline && (
        <PendingVouchersMini count={pendingCount} />
      )}

      <FlatList
        data={sortedDevices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onQuickAmount={(amount) => {
              // TODO: set selected + open QuickSendDock
              console.log('quick amount', amount);
            }}
            onSend={() => {
              // TODO: open send flow
              console.log('send');
            }}
          />
        )}
      />

      <QuickSendDock
        visible={!!selected}
        receiver={selected}
        onClose={() => {}}
        onSend={(amount, message) => {
          // TODO: integrate /api/p2p/create (+ optional social-tips)
          console.log('send amount', amount, message);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 120 },
});