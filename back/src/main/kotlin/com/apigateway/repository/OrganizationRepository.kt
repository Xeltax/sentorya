package com.apigateway.repository

import com.apigateway.entity.Organizations
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface OrganizationRepository : JpaRepository<Organizations, String> {

    fun findById(id: UUID): java.util.Optional<Organizations>

    fun findByName(name: String): Organizations?

    fun findByOwnerId(ownerId: UUID): Organizations?
}