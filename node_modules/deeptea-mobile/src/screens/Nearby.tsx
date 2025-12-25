import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/appStore';
import { BLEPermissions } from '../services/ble-permissions';
import { ble } from '../services/ble';

export default function Nearby() {
const [hasPerms, setHasPerms] = useState<boolean | null>(null);
useEffect(()=>{(async()=>{const ok = await BLEPermissions.check() || await BLEPermissions.request(); setHasPerms(ok);})();},[]);
const devices = useAppStore(s => s.devices);
const start = async () => { try { await ble.startScanning(); } catch (e) {} };
const stop = async () => { try { await ble.stopScanning(); } catch (e) {} };
if(hasPerms===false) return (<View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>Нет разрешений BLE/Location</Text></View>);
if(hasPerms===null) return (<View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>Проверка разрешений…</Text></View>);
return (
<View style={{ flex:1, padding:16 }}>
<Text style={{ fontSize:20, fontWeight:'600' }}>Рядом</Text>
<View style={{ flexDirection:'row', gap:12, marginVertical:12 }}>
<TouchableOpacity onPress={start}><Text>Сканировать</Text></TouchableOpacity>
<TouchableOpacity onPress={stop}><Text>Стоп</Text></TouchableOpacity>
</View>
<FlatList
data={devices}
keyExtractor={(d)=>d.id}
renderItem={({item}) => (
<View style={{ padding:12, borderBottomWidth:1, borderColor:'#eee' }}>
<Text>EID: {item.id}</Text>
<Text>RSSI: {item.rssi} (EMA: {item.rssiEma?.toFixed(1) ?? '—'})</Text>
</View>
)}
ListEmptyComponent={<Text>Никого рядом…</Text>}
/>
</View>
);
}