package com.deeptea.mesh

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

/**
 * Очень простой skeleton mesh-роутера для DeepTea.
 *
 * Задачи:
 * - хранить известных пиров;
 * - дедуплицировать сообщения по id;
 * - давать API для отправки/получения сообщений верхним уровням.
 *
 * Реальная логика (multi-hop, store-and-forward, приоритизация) будет добавлена позже.
 */
class MeshRouter {

    interface Listener {
        fun onIncoming(message: MeshMessage, rssi: Int)
    }

    private val peers: MutableMap<String, MeshPeer> = ConcurrentHashMap()
    private val seenMessages: MutableSet<String> = ConcurrentHashMap.newKeySet()
    private val listeners: MutableList<Listener> = CopyOnWriteArrayList()

    fun addListener(listener: Listener) {
        listeners.add(listener)
    }

    fun removeListener(listener: Listener) {
        listeners.remove(listener)
    }

    /**
     * Вызывается BLE-слоем при получении "сырых" пакетов.
     * На этом шаге мы уже должны иметь распарсенный MeshMessage и оценку RSSI.
     */
    fun handleIncoming(message: MeshMessage, rssi: Int) {
        if (!seenMessages.add(message.id)) {
            // Уже видели этот пакет — игнорируем
            return
        }

        val now = System.currentTimeMillis()
        val existing = peers[message.fromPeerId]
        val updated = MeshPeer(
            id = message.fromPeerId,
            lastSeenAt = now,
            lastRssi = rssi
        )
        peers[message.fromPeerId] = updated

        // TODO: здесь в будущем можно добавить TTL, multi-hop routing, store-and-forward
        listeners.forEach { it.onIncoming(message, rssi) }
    }

    /**
     * Отправка сообщения в сторону конкретного пира или broadcast.
     * Пока это только skeleton: реальная реализация будет через BLE-уровень.
     */
    fun prepareOutgoing(
        toPeerId: String?,
        payload: ByteArray,
        ttl: Int = 5
    ): MeshMessage {
        val id = java.util.UUID.randomUUID().toString()
        val now = System.currentTimeMillis()
        return MeshMessage(
            id = id,
            fromPeerId = localPeerId(),
            toPeerId = toPeerId,
            ttl = ttl,
            createdAt = now,
            payload = payload
        )
    }

    /**
     * Возвращает snapshot известных пиров.
     */
    fun getPeers(): List<MeshPeer> = peers.values.toList()

    private fun localPeerId(): String {
        // TODO: привязать к локальному ключу / identity устройства.
        // Временно — random UUID, но в реальном проекте лучше использовать устойчивый идентификатор.
        return "local"
    }
}