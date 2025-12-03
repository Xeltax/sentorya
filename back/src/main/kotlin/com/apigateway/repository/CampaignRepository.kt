package com.apigateway.repository

import com.apigateway.entity.Campaign
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface CampaignRepository : JpaRepository<Campaign, String> {
    fun findByCampaignId(campaignId: String): Optional<Campaign>
    fun existsByCampaignId(campaignId: String): Boolean

    @Query("SELECT c FROM Campaign c LEFT JOIN FETCH c.users WHERE c.id = :id")
    fun findByIdWithUsers(id: String): Optional<Campaign>

    @Query("SELECT c FROM Campaign c LEFT JOIN FETCH c.users WHERE c.campaignId = :campaignId")
    fun findByCampaignIdWithUsers(campaignId: String): Optional<Campaign>

    @Query("SELECT DISTINCT c FROM Campaign c LEFT JOIN FETCH c.users")
    fun findAllWithUsers(): List<Campaign>
}
