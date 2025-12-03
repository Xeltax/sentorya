package com.apigateway.entity

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "organization_member")
data class OrganizationMember (
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,
    val organizationId: UUID,
    val userId: UUID,
    @Enumerated(EnumType.STRING)
    val role: OrganizationRole = OrganizationRole.MEMBER
)