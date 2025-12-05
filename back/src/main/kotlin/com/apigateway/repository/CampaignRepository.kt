package com.apigateway.repository

import com.apigateway.entity.Campaign
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface CampaignRepository : JpaRepository<Campaign, String> {
    fun findByCampaignId(campaignId: String): Optional<Campaign>
    fun existsByCampaignId(campaignId: String): Boolean

    fun findByOrganizationId(organizationId: UUID): Optional<List<Campaign>>
}
