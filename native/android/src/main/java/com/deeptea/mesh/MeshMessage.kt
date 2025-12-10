package com.deeptea.mesh

/**
 * Базовое сообщение mesh-уровня для DeepTea.
 * На этом уровне мы не знаем о ваучерах или токенах — только о бинарном payload.
 */
data class MeshMessage(
    val id: String,
    val fromPeerId: String,
    val toPeerId: String?, // null = broadcast
    val ttl: Int,
    val createdAt: Long,
    val payload: ByteArray
)