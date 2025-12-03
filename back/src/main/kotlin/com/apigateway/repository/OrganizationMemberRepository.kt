package com.apigateway.repository

import com.apigateway.entity.OrganizationMember
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationMemberRepository : JpaRepository<OrganizationMember, String> {
    fun findByOrganizationIdAndUserId(organizationId: UUID, userId: UUID): OrganizationMember?

    fun findByOrganizationId(organizationId: UUID): List<OrganizationMember>
}