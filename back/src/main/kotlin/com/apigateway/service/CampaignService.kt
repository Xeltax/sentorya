package com.apigateway.service

import com.apigateway.dto.*
import com.apigateway.entity.Campaign
import com.apigateway.exception.BadRequestException
import com.apigateway.exception.ConflictException
import com.apigateway.exception.ResourceNotFoundException
import com.apigateway.gophish.exception.GoPhishException
import com.apigateway.gophish.service.GoPhishService
import com.apigateway.repository.CampaignRepository
import com.apigateway.repository.UserRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

private val logger = KotlinLogging.logger {}

@Service
@Transactional
class CampaignService(
    private val campaignRepository: CampaignRepository,
    private val userRepository: UserRepository,
    private val goPhishService: GoPhishService
) {

    fun createCampaign(request: CreateCampaignRequest): CampaignResponse {
        logger.info { "Creating campaign with ID: ${request.campaignId}, GoPhish: ${request.createInGoPhish}" }

        if (campaignRepository.existsByCampaignId(request.campaignId)) {
            throw ConflictException("Une campagne avec cet ID existe déjà")
        }

        // Créer la campagne dans la BDD locale d'abord
        val campaign = Campaign(
            name = request.name,
            campaignId = request.campaignId,
            organizationId = request.organizationId,
            goPhishTemplateName = request.templateName,
            goPhishPageName = request.pageName,
            goPhishSmtpName = request.smtpProfileName,
            phishingUrl = request.phishingUrl
        )

        val savedCampaign = campaignRepository.save(campaign)

        // Si demandé, créer aussi dans GoPhish
        if (request.createInGoPhish) {
            try {
                // Vérifier que le profil SMTP est fourni
                if (request.smtpProfileName.isNullOrBlank()) {
                    throw BadRequestException("Le profil SMTP est requis pour créer une campagne GoPhish")
                }

                if (request.phishingUrl.isNullOrBlank()) {
                    throw BadRequestException("L'URL de phishing est requise pour créer une campagne GoPhish")
                }

                // Créer la campagne complète dans GoPhish
                val goPhishCampaign = goPhishService.createFullCampaign(
                    campaignName = request.name,
                    organizationId = request.organizationId,
                    templateName = request.templateName ?: "Default Template",
                    pageName = request.pageName ?: "Default Page",
                    smtpProfileName = request.smtpProfileName,
                    phishingUrl = request.phishingUrl,
                    launchDate = request.launchDate
                )

                // Mettre à jour la campagne locale avec les IDs GoPhish
                savedCampaign.goPhishCampaignId = goPhishCampaign.id
                savedCampaign.goPhishGroupId = goPhishCampaign.groups.firstOrNull()?.let { group ->
                    // Récupérer l'ID du groupe depuis GoPhish
                    goPhishService.getAllGroups().find { it.name == group.name }?.id
                }

                campaignRepository.save(savedCampaign)

                logger.info { "Campagne GoPhish créée avec succès: ID=${goPhishCampaign.id}" }
            } catch (e: GoPhishException) {
                logger.error(e) { "Erreur lors de la création de la campagne GoPhish, mais campagne locale créée" }
                // On ne rollback pas la transaction locale, la campagne existe dans notre BDD
                // mais pas dans GoPhish
                throw BadRequestException("Campagne créée localement mais erreur GoPhish: ${e.message}")
            }
        }

        return savedCampaign.toResponse()
    }

    @Transactional(readOnly = true)
    fun getById(id: UUID): CampaignResponse {
        val campaign = campaignRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }
        return campaign.toResponse()
    }

    @Transactional(readOnly = true)
    fun getByCampaignId(campaignId: String): CampaignResponse {
        val campaign = campaignRepository.findByCampaignId(campaignId)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }
        return campaign.toResponse()
    }

    @Transactional(readOnly = true)
    fun getAllCampaigns(): List<CampaignResponse> {
        return campaignRepository.findAll().map { it.toResponse() }
    }

    fun updateCampaign(id: String, request: UpdateCampaignRequest): CampaignResponse {
        val campaign = campaignRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }

        request.name?.let { campaign.name = it }
        request.templateName?.let { campaign.goPhishTemplateName = it }
        request.pageName?.let { campaign.goPhishPageName = it }
        request.smtpProfileName?.let { campaign.goPhishSmtpName = it }
        request.phishingUrl?.let { campaign.phishingUrl = it }

        val updatedCampaign = campaignRepository.save(campaign)
        return updatedCampaign.toResponse()
    }

    fun deleteCampaign(id: UUID) {
        val campaign = campaignRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }

        // Supprimer aussi dans GoPhish si la campagne y existe
        campaign.goPhishCampaignId?.let { goPhishId ->
            try {
                goPhishService.deleteCampaign(goPhishId)
                logger.info { "Campagne GoPhish $goPhishId supprimée" }
            } catch (e: GoPhishException) {
                logger.error(e) { "Erreur lors de la suppression de la campagne GoPhish $goPhishId" }
                // On continue quand même la suppression locale
            }
        }

        // Supprimer le groupe GoPhish si nécessaire
        campaign.goPhishGroupId?.let { groupId ->
            try {
                goPhishService.deleteGroup(groupId)
                logger.info { "Groupe GoPhish $groupId supprimé" }
            } catch (e: GoPhishException) {
                logger.error(e) { "Erreur lors de la suppression du groupe GoPhish $groupId" }
            }
        }

        campaignRepository.delete(campaign)
        logger.info { "Campaign deleted: $id" }
    }

    /**
     * Récupère les résultats d'une campagne GoPhish
     */
    @Transactional(readOnly = true)
    fun getCampaignResults(id: UUID): Any {
        val campaign = campaignRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Campaign not found") }

        if (campaign.goPhishCampaignId == null) {
            throw BadRequestException("Cette campagne n'est pas liée à GoPhish")
        }

        return goPhishService.getCampaignSummary(campaign.goPhishCampaignId!!)
    }

    /**
     * Synchronise les membres d'une organisation avec les groupes GoPhish des campagnes
     */
    fun syncOrganizationCampaigns(organizationId: java.util.UUID) {
        val campaigns = campaignRepository.findByOrganizationId(organizationId)
            .orElse(emptyList())

        val goPhishGroupIds = campaigns
            .mapNotNull { it.goPhishGroupId }
            .distinct()

        if (goPhishGroupIds.isNotEmpty()) {
            goPhishService.syncOrganizationMembers(organizationId, goPhishGroupIds)
            logger.info { "Synchronisation des ${goPhishGroupIds.size} groupes GoPhish pour l'organisation $organizationId" }
        }
    }
}

fun Campaign.toResponse() = CampaignResponse(
    id = this.id!!,
    name = this.name,
    campaignId = this.campaignId,
    organizationId = this.organizationId,
    goPhishCampaignId = this.goPhishCampaignId,
    goPhishGroupId = this.goPhishGroupId,
    templateName = this.goPhishTemplateName,
    pageName = this.goPhishPageName,
    smtpProfileName = this.goPhishSmtpName,
    phishingUrl = this.phishingUrl
)