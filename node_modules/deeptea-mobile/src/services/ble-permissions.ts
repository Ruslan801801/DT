import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export class BLEPermissions {
static async request(): Promise<boolean> {
if (Platform.OS === 'android') return this.requestAndroid();
return true; // iOS via Info.plist
}

private static async requestAndroid(): Promise<boolean> {
try {
const apiLevel = Number(Platform.Version) || 30;
const perms = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
if (apiLevel >= 31) {
perms.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
}
const res = await PermissionsAndroid.requestMultiple(perms);
const ok = Object.values(res).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
if (!ok) this.alert();
return ok;
} catch (e) {
console.error('BLE permission error', e);
return false;
}
}

static async check(): Promise<boolean> {
if (Platform.OS === 'android') {
const apiLevel = Number(Platform.Version) || 30;
const hasLoc = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
if (apiLevel >= 31) {
const hasScan = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
const hasConn = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
return hasLoc && hasScan && hasConn;
}
return hasLoc;
}
return true;
}

private static alert() {
Alert.alert(
'Нужны разрешения',
'Bluetooth и геолокация необходимы для поиска устройств поблизости.',
[{ text: 'Ок' }, { text: 'Настройки', onPress: () => Linking.openSettings() }]
);
}
}