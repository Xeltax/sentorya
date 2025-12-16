package com.apigateway.gophish.service

import com.apigateway.entity.User
import com.apigateway.gophish.client.GoPhishClient
import com.apigateway.gophish.dto.*
import com.apigateway.gophish.exception.GoPhishException
import com.apigateway.gophish.exception.GoPhishNotFoundException
import com.apigateway.repository.OrganizationMemberRepository
import com.apigateway.repository.UserRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.*

private val logger = KotlinLogging.logger {}

/**
 * Service principal pour gérer les interactions avec GoPhish
 */
@Service
@Transactional
class GoPhishService(
    private val goPhishClient: GoPhishClient,
    private val userRepository: UserRepository,
    private val organizationMemberRepository: OrganizationMemberRepository
) {

    // ==================== GROUPS ====================

    /**
     * Crée un groupe GoPhish à partir des membres d'une organisation
     */
    fun createGroupFromOrganization(organizationId: UUID, groupName: String): GoPhishGroup {
        logger.info { "Création du groupe GoPhish pour l'organisation $organizationId: $groupName" }

        // Récupérer les membres de l'organisation
        val members = organizationMemberRepository.findByOrganizationId(organizationId)

        if (members.isEmpty()) {
            throw IllegalArgumentException("L'organisation ne contient aucun membre")
        }

        // Convertir les membres en targets GoPhish
        val targets = members.mapNotNull { member ->
            userRepository.findById(member.userId).map { user ->
                user.toGoPhishTarget()
            }.orElse(null)
        }

        // Créer le groupe dans GoPhish
        val request = CreateGoPhishGroupRequest(
            name = groupName,
            targets = targets
        )

        return goPhishClient.createGroup(request)
    }

    /**
     * Met à jour un groupe GoPhish existant avec les membres actuels d'une organisation
     */
    fun updateGroupFromOrganization(goPhishGroupId: Long, organizationId: UUID): GoPhishGroup {
        logger.info { "Mise à jour du groupe GoPhish $goPhishGroupId pour l'organisation $organizationId" }

        // Récupérer le groupe existant
        val existingGroup = goPhishClient.getGroup(goPhishGroupId)

        // Récupérer les membres de l'organisation
        val members = organizationMemberRepository.findByOrganizationId(organizationId)

        // Convertir les membres en targets GoPhish
        val targets = members.mapNotNull { member ->
            userRepository.findById(member.userId).map { user ->
                user.toGoPhishTarget()
            }.orElse(null)
        }

        // Mettre à jour le groupe
        val updatedGroup = existingGroup.copy(targets = targets)

        return goPhishClient.updateGroup(goPhishGroupId, updatedGroup)
    }

    /**
     * Ajoute un utilisateur à un groupe GoPhish existant
     */
    fun addUserToGroup(goPhishGroupId: Long, userId: UUID) {
        logger.info { "Ajout de l'utilisateur $userId au groupe GoPhish $goPhishGroupId" }

        val user = userRepository.findById(userId)
            .orElseThrow { IllegalArgumentException("Utilisateur non trouvé") }

        val group = goPhishClient.getGroup(goPhishGroupId)

        // Vérifier si l'utilisateur n'est pas déjà dans le groupe
        if (group.targets.any { it.email == user.email }) {
            logger.warn { "L'utilisateur ${user.email} est déjà dans le groupe" }
            return
        }

        // Ajouter l'utilisateur au groupe
        val updatedTargets = group.targets + user.toGoPhishTarget()
        val updatedGroup = group.copy(targets = updatedTargets)

        goPhishClient.updateGroup(goPhishGroupId, updatedGroup)
    }

    /**
     * Retire un utilisateur d'un groupe GoPhish
     */
    fun removeUserFromGroup(goPhishGroupId: Long, userEmail: String) {
        logger.info { "Retrait de l'utilisateur $userEmail du groupe GoPhish $goPhishGroupId" }

        val group = goPhishClient.getGroup(goPhishGroupId)

        // Retirer l'utilisateur du groupe
        val updatedTargets = group.targets.filter { it.email != userEmail }
        val updatedGroup = group.copy(targets = updatedTargets)

        goPhishClient.updateGroup(goPhishGroupId, updatedGroup)
    }

    /**
     * Récupère tous les groupes GoPhish
     */
    fun getAllGroups(): List<GoPhishGroup> {
        return goPhishClient.getGroups()
    }

    /**
     * Récupère un groupe GoPhish par son ID
     */
    fun getGroup(id: Long): GoPhishGroup {
        return goPhishClient.getGroup(id)
    }

    /**
     * Supprime un groupe GoPhish
     */
    fun deleteGroup(id: Long) {
        goPhishClient.deleteGroup(id)
    }

    // ==================== TEMPLATES ====================

    /**
     * Récupère tous les templates GoPhish
     */
    fun getAllTemplates(): List<GoPhishTemplate> {
        return goPhishClient.getTemplates()
    }

    /**
     * Récupère un template GoPhish par son nom
     */
    fun getTemplateByName(name: String): GoPhishTemplate? {
        return goPhishClient.getTemplates().find { it.name == name }
    }

    /**
     * Crée un template GoPhish
     */
    fun createTemplate(request: CreateGoPhishTemplateRequest): GoPhishTemplate {
        logger.info { "Création du template GoPhish: ${request.name}" }
        return goPhishClient.createTemplate(request)
    }

    /**
     * Récupère ou crée un template par défaut
     */
    fun getOrCreateDefaultTemplate(templateName: String): GoPhishTemplate {
        // Essayer de récupérer le template existant
        val existing = getTemplateByName(templateName)
        if (existing != null) {
            return existing
        }

        // Créer un template par défaut
        logger.info { "Création d'un template par défaut: $templateName" }
        val request = CreateGoPhishTemplateRequest(
            name = templateName,
            subject = "Message important",
            html = """
                <html>
                <body>
                    <p>Bonjour {{.FirstName}} {{.LastName}},</p>
                    <p>Veuillez cliquer sur le lien suivant : <a href="{{.URL}}">Cliquez ici</a></p>
                </body>
                </html>
            """.trimIndent()
        )

        return goPhishClient.createTemplate(request)
    }

    // ==================== PAGES ====================

    /**
     * Récupère toutes les landing pages GoPhish
     */
    fun getAllPages(): List<GoPhishPage> {
        return goPhishClient.getPages()
    }

    /**
     * Récupère une landing page GoPhish par son nom
     */
    fun getPageByName(name: String): GoPhishPage? {
        return goPhishClient.getPages().find { it.name == name }
    }

    /**
     * Crée une landing page GoPhish
     */
    fun createPage(request: CreateGoPhishPageRequest): GoPhishPage {
        logger.info { "Création de la landing page GoPhish: ${request.name}" }
        return goPhishClient.createPage(request)
    }

    /**
     * Récupère ou crée une landing page par défaut
     */
    fun getOrCreateDefaultPage(pageName: String): GoPhishPage {
        // Essayer de récupérer la page existante
        val existing = getPageByName(pageName)
        if (existing != null) {
            return existing
        }

        // Créer une page par défaut
        logger.info { "Création d'une landing page par défaut: $pageName" }
        val request = CreateGoPhishPageRequest(
            name = pageName,
            html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Connexion</title>
                </head>
                <body>
                    <h1>Connexion</h1>
                    <form method="post">
                        <input type="text" name="username" placeholder="Nom d'utilisateur" />
                        <input type="password" name="password" placeholder="Mot de passe" />
                        <button type="submit">Se connecter</button>
                    </form>
                </body>
                </html>
            """.trimIndent(),
            captureCredentials = true,
            capturePasswords = true,
            redirectUrl = "https://www.google.com"
        )

        return goPhishClient.createPage(request)
    }

    // ==================== SMTP ====================

    /**
     * Récupère tous les profils SMTP GoPhish
     */
    fun getAllSMTPProfiles(): List<GoPhishSMTP> {
        return goPhishClient.getSMTPProfiles()
    }

    /**
     * Récupère un profil SMTP GoPhish par son nom
     */
    fun getSMTPProfileByName(name: String): GoPhishSMTP? {
        return goPhishClient.getSMTPProfiles().find { it.name == name }
    }

    // ==================== CAMPAIGNS ====================

    /**
     * Crée une campagne GoPhish complète
     */
    fun createFullCampaign(
        campaignName: String,
        organizationId: UUID,
        templateName: String = "Default Template",
        pageName: String = "Default Page",
        smtpProfileName: String,
        phishingUrl: String,
        launchDate: LocalDateTime? = null
    ): GoPhishCampaign {
        logger.info { "Création d'une campagne GoPhish complète: $campaignName" }

        try {
            // 1. Créer ou récupérer le groupe
            val groupName = "Group_${organizationId}_${System.currentTimeMillis()}"
            val group = createGroupFromOrganization(organizationId, groupName)

            // 2. Récupérer ou créer le template
            val template = getOrCreateDefaultTemplate(templateName)

            // 3. Récupérer ou créer la landing page
            val page = getOrCreateDefaultPage(pageName)

            // 4. Vérifier que le profil SMTP existe
            val smtp = getSMTPProfileByName(smtpProfileName)
                ?: throw IllegalArgumentException("Profil SMTP '$smtpProfileName' non trouvé dans GoPhish")

            // 5. Créer la campagne
            val request = CreateGoPhishCampaignRequest(
                name = campaignName,
                template = GoPhishCampaignTemplate(name = template.name),
                page = GoPhishCampaignPage(name = page.name),
                smtp = GoPhishCampaignSMTP(name = smtp.name),
                url = phishingUrl,
                groups = listOf(GoPhishCampaignGroup(name = group.name)),
                launchDate = launchDate?.let { formatDateTime(it) }
            )

            val campaign = goPhishClient.createCampaign(request)

            logger.info { "Campagne GoPhish créée avec succès: ID=${campaign.id}" }

            return campaign

        } catch (e: GoPhishException) {
            logger.error(e) { "Erreur lors de la création de la campagne GoPhish" }
            throw e
        }
    }

    /**
     * Récupère toutes les campagnes GoPhish
     */
    fun getAllCampaigns(): List<GoPhishCampaign> {
        return goPhishClient.getCampaigns()
    }

    /**
     * Récupère une campagne GoPhish par son ID
     */
    fun getCampaign(id: Long): GoPhishCampaign {
        return goPhishClient.getCampaign(id)
    }

    /**
     * Récupère le résumé d'une campagne
     */
    fun getCampaignSummary(id: Long): GoPhishCampaignSummary {
        return goPhishClient.getCampaignSummary(id)
    }

    /**
     * Marque une campagne comme terminée
     */
    fun completeCampaign(id: Long): GoPhishCampaign {
        logger.info { "Marquage de la campagne $id comme terminée" }
        return goPhishClient.completeCampaign(id)
    }

    /**
     * Supprime une campagne GoPhish
     */
    fun deleteCampaign(id: Long) {
        logger.info { "Suppression de la campagne GoPhish $id" }
        goPhishClient.deleteCampaign(id)
    }

    // ==================== UTILS ====================

    /**
     * Formate une date au format ISO8601 pour GoPhish
     */
    private fun formatDateTime(dateTime: LocalDateTime): String {
        return dateTime.atOffset(ZoneOffset.UTC).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
    }

    /**
     * Synchronise les membres d'une organisation avec tous les groupes GoPhish associés
     */
    fun syncOrganizationMembers(organizationId: UUID, goPhishGroupIds: List<Long>) {
        logger.info { "Synchronisation des membres de l'organisation $organizationId avec GoPhish" }

        goPhishGroupIds.forEach { groupId ->
            try {
                updateGroupFromOrganization(groupId, organizationId)
            } catch (e: Exception) {
                logger.error(e) { "Erreur lors de la synchronisation du groupe $groupId" }
            }
        }
    }
}

/**
 * Extension pour convertir un User en GoPhishTarget
 */
private fun User.toGoPhishTarget(): GoPhishTarget {
    val nameParts = this.name.split(" ", limit = 2)
    val firstName = nameParts.getOrNull(0) ?: ""
    val lastName = nameParts.getOrNull(1) ?: ""

    return GoPhishTarget(
        email = this.email,
        firstName = firstName,
        lastName = lastName,
        position = ""
    )
}