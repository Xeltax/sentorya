package com.apigateway.service

import com.apigateway.dto.*
import com.apigateway.entity.Campaign
import com.apigateway.exception.BadRequestException
import com.apigateway.exception.ConflictException
import com.apigateway.exception.ResourceNotFoundException
import com.apigateway.repository.CampaignRepository
import com.apigateway.repository.UserRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

private val logger = KotlinLogging.logger {}

@Service
@Transactional
class CampaignService(
    private val campaignRepository: CampaignRepository,
    private val userRepository: UserRepository
) {

    fun createCampaign(request: CreateCampaignRequest): CampaignResponse {
        logger.info { "Creating campaign with ID: ${request.campaignId}" }

        if (campaignRepository.existsByCampaignId(request.campaignId)) {
            throw ConflictException("Une campagne avec cet ID existe déjà")
        }

        val campaign = Campaign(
            name = request.name,
            campaignId = request.campaignId
        )

        val savedCampaign = campaignRepository.save(campaign)
        return savedCampaign.toResponse()
    }

    @Transactional(readOnly = true)
    fun getById(id: String): CampaignResponse {
        val campaign = campaignRepository.findByIdWithUsers(id)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }
        return campaign.toResponse()
    }

    @Transactional(readOnly = true)
    fun getByCampaignId(campaignId: String): CampaignResponse {
        val campaign = campaignRepository.findByCampaignIdWithUsers(campaignId)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }
        return campaign.toResponse()
    }

    @Transactional(readOnly = true)
    fun getAllCampaigns(): List<CampaignResponse> {
        return campaignRepository.findAllWithUsers().map { it.toResponse() }
    }

    fun updateCampaign(id: String, request: UpdateCampaignRequest): CampaignResponse {
        val campaign = campaignRepository.findByIdWithUsers(id)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }

        request.name?.let { campaign.name = it }

        val updatedCampaign = campaignRepository.save(campaign)
        return updatedCampaign.toResponse()
    }

    fun deleteCampaign(id: String) {
        if (!campaignRepository.existsById(id)) {
            throw ResourceNotFoundException("Campaign not found")
        }
        campaignRepository.deleteById(id)
        logger.info { "Campaign deleted: $id" }
    }

    fun addUserToCampaign(request: CampaignUserRequest): CampaignResponse {
        val campaign = campaignRepository.findByCampaignIdWithUsers(request.campaignId)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }

        val user = userRepository.findById(request.userId)
            .orElseThrow { ResourceNotFoundException("User not found") }

        if (campaign.users.any { it.id == user.id }) {
            throw BadRequestException("User already in campaign")
        }

        campaign.addUser(user)
        val updatedCampaign = campaignRepository.save(campaign)
        
        logger.info { "User ${user.id} added to campaign ${campaign.campaignId}" }
        return updatedCampaign.toResponse()
    }

    fun removeUserFromCampaign(request: CampaignUserRequest): CampaignResponse {
        val campaign = campaignRepository.findByCampaignIdWithUsers(request.campaignId)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }

        val user = userRepository.findById(request.userId)
            .orElseThrow { ResourceNotFoundException("User not found") }

        if (campaign.users.none { it.id == user.id }) {
            throw BadRequestException("User not in campaign")
        }

        campaign.removeUser(user)
        val updatedCampaign = campaignRepository.save(campaign)
        
        logger.info { "User ${user.id} removed from campaign ${campaign.campaignId}" }
        return updatedCampaign.toResponse()
    }
}

fun Campaign.toResponse() = CampaignResponse(
    id = this.id!!,
    name = this.name,
    campaignId = this.campaignId,
    users = this.users.map { it.toResponse() }
)
