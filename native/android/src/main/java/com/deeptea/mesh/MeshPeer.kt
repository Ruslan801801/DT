package com.deeptea.mesh

/**
 * Информация о соседе в mesh-сети.
 * Здесь можно хранить RSSI, последний контакт и другие метрики качества связи.
 */
data class MeshPeer(
    val id: String,
    val lastSeenAt: Long,
    val lastRssi: Int
)