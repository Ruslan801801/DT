import Foundation
import CoreBluetooth

@objc(BLEModule)
class BLEModule: RCTEventEmitter, CBCentralManagerDelegate {

    private var centralManager: CBCentralManager!
    private var hasListeners = false

    override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: .main)
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return ["DeepTeaBleEvent"]
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    // MARK: - API methods

    @objc
    func startScanning(_ resolve: RCTPromiseResolveBlock,
                       reject: RCTPromiseRejectBlock) {
        // TODO: добавить фильтр по нужному CBUUID сервиса
        centralManager.scanForPeripherals(withServices: nil, options: nil)
        resolve(nil)
    }

    @objc
    func stopScanning(_ resolve: RCTPromiseResolveBlock,
                      reject: RCTPromiseRejectBlock) {
        centralManager.stopScan()
        resolve(nil)
    }

    @objc
    func getBleState(_ resolve: RCTPromiseResolveBlock,
                     reject: RCTPromiseRejectBlock) {
        let state: String
        switch centralManager.state {
        case .unsupported:
            state = "unsupported"
        case .poweredOff:
            state = "disabled"
        case .poweredOn:
            state = "enabled"
        default:
            state = "disabled"
        }
        resolve(state)
    }

    // MARK: - CBCentralManagerDelegate

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        // опционально можно отправлять event о смене состояния
    }

    func centralManager(_ central: CBCentralManager,
                        didDiscover peripheral: CBPeripheral,
                        advertisementData: [String : Any],
                        rssi RSSI: NSNumber) {
        guard hasListeners else { return }

        let payload: [String: Any] = [
            "type": "device",
            "id": peripheral.identifier.uuidString,
            "rssi": RSSI.intValue,
            "ts": Date().timeIntervalSince1970 * 1000.0
        ]
        sendEvent(withName: "DeepTeaBleEvent", body: payload)
    }
}