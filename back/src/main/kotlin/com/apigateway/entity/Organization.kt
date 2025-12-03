package com.apigateway.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "organizations")
data class Organizations (
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(unique = true, nullable = false)
    val name: String,

    @Column(nullable = true)
    val address: String?,

    @Column(unique = true, nullable = false)
    val email : String,

    @Column(name = "phone_number", nullable = true)
    val phoneNumber: String?,

    @Column(name = "owner_id", nullable = false)
    var ownerId : UUID,

    @CreationTimestamp
    @Column(name = "created_at", nullable = true, updatable = false)
    val createdAt: LocalDateTime?,

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = true)
    val updatedAt: LocalDateTime?
)