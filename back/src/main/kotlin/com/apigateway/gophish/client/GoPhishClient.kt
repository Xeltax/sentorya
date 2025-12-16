package com.apigateway.gophish.client

import com.apigateway.gophish.config.GoPhishConfig
import com.apigateway.gophish.dto.*
import com.apigateway.gophish.exception.*
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import mu.KotlinLogging
import org.springframework.http.*
import org.springframework.stereotype.Component
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.ResourceAccessException
import java.net.URI

private val logger = KotlinLogging.logger {}

/**
 * Client HTTP pour communiquer avec l'API GoPhish
 */
@Component
class GoPhishClient(
    private val config: GoPhishConfig,
    private val objectMapper: ObjectMapper,
    private val restTemplate: RestTemplate
) {

    private fun getHeaders(): HttpHeaders {
        return HttpHeaders().apply {
            contentType = MediaType.APPLICATION_JSON
            set("Authorization", "Bearer ${config.apiKey}")
        }
    }

    /**
     * Exécute une requête GET
     */
    private inline fun <reified T> get(endpoint: String): T {
        return executeWithRetry {
            val url = "${config.apiUrl}${endpoint}"
            logger.debug { "GET $url" }

            try {
                val response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    HttpEntity<Any>(getHeaders()),
                    String::class.java
                )

                handleResponse<T>(response)
            } catch (e: HttpClientErrorException) {
                handleHttpError<Unit>(e)
            } catch (e: HttpServerErrorException) {
                handleHttpError(e)
            } catch (e: ResourceAccessException) {
                throw GoPhishConnectionException("Erreur de connexion à GoPhish", e)
            }
        }
    }

    /**
     * Exécute une requête POST
     */
    private inline fun <reified T> post(endpoint: String, body: Any): T {
        return executeWithRetry {
            val url = "${config.apiUrl}${endpoint}"
            logger.debug { "POST $url" }

            try {
                val response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    HttpEntity(body, getHeaders()),
                    String::class.java
                )

                handleResponse<T>(response)
            } catch (e: HttpClientErrorException) {
                handleHttpError<Unit>(e)
            } catch (e: HttpServerErrorException) {
                handleHttpError(e)
            } catch (e: ResourceAccessException) {
                throw GoPhishConnectionException("Erreur de connexion à GoPhish", e)
            }
        }
    }

    /**
     * Exécute une requête PUT
     */
    private inline fun <reified T> put(endpoint: String, body: Any): T {
        return executeWithRetry {
            val url = "${config.apiUrl}${endpoint}"
            logger.debug { "PUT $url" }

            try {
                val response = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    HttpEntity(body, getHeaders()),
                    String::class.java
                )

                handleResponse<T>(response)
            } catch (e: HttpClientErrorException) {
                handleHttpError<Unit>(e)
            } catch (e: HttpServerErrorException) {
                handleHttpError(e)
            } catch (e: ResourceAccessException) {
                throw GoPhishConnectionException("Erreur de connexion à GoPhish", e)
            }
        }
    }

    /**
     * Exécute une requête DELETE
     */
    private fun delete(endpoint: String) {
        return executeWithRetry {
            val url = "${config.apiUrl}${endpoint}"
            logger.debug { "DELETE $url" }

            try {
                restTemplate.exchange(
                    url,
                    HttpMethod.DELETE,
                    HttpEntity<Any>(getHeaders()),
                    String::class.java
                )
            } catch (e: HttpClientErrorException) {
                if (e.statusCode != HttpStatus.NOT_FOUND) {
                    handleHttpError<Unit>(e)
                }
            } catch (e: HttpServerErrorException) {
                handleHttpError(e)
            } catch (e: ResourceAccessException) {
                throw GoPhishConnectionException("Erreur de connexion à GoPhish", e)
            }
        }
    }

    /**
     * Gère la réponse HTTP et la désérialise
     */
    private inline fun <reified T> handleResponse(response: ResponseEntity<String>): T {
        val body = response.body ?: throw GoPhishApiException("Réponse vide de GoPhish")

        return try {
            objectMapper.readValue<T>(body)
        } catch (e: Exception) {
            logger.error(e) { "Erreur de désérialisation de la réponse GoPhish: $body" }
            throw GoPhishApiException("Erreur de désérialisation de la réponse", cause = e)
        }
    }

    /**
     * Gère les erreurs HTTP
     */
    private fun <T> handleHttpError(e: HttpClientErrorException): Nothing {
        logger.error { "Erreur HTTP ${e.statusCode}: ${e.responseBodyAsString}" }

        when (e.statusCode) {
            HttpStatus.NOT_FOUND -> throw GoPhishNotFoundException("Ressource", "inconnue")
            HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN ->
                throw GoPhishAuthenticationException("Authentification échouée")
            HttpStatus.CONFLICT ->
                throw GoPhishConflictException(e.responseBodyAsString)
            else ->
                throw GoPhishApiException(e.responseBodyAsString, e.statusCode.value(), e)
        }
    }

    /**
     * Gère les erreurs HTTP serveur
     */
    private fun <T> handleHttpError(e: HttpServerErrorException): T {
        logger.error { "Erreur serveur HTTP ${e.statusCode}: ${e.responseBodyAsString}" }
        throw GoPhishApiException(e.responseBodyAsString, e.statusCode.value(), e)
    }

    /**
     * Exécute une action avec retry
     */
    private fun <T> executeWithRetry(action: () -> T): T {
        var lastException: Exception? = null

        repeat(config.retryAttempts) { attempt ->
            try {
                return action()
            } catch (e: GoPhishConnectionException) {
                lastException = e
                if (attempt < config.retryAttempts - 1) {
                    logger.warn { "Tentative ${attempt + 1} échouée, nouvelle tentative dans ${config.retryDelayMs}ms" }
                    Thread.sleep(config.retryDelayMs * (attempt + 1))
                }
            } catch (e: Exception) {
                // Pour les autres exceptions, on ne retry pas
                throw e
            }
        }

        throw lastException!!
    }

    // ==================== GROUPS ====================

    fun getGroups(): List<GoPhishGroup> {
        return get("/api/groups/")
    }

    fun getGroup(id: Long): GoPhishGroup {
        return get("/api/groups/$id")
    }

    fun createGroup(request: CreateGoPhishGroupRequest): GoPhishGroup {
        return post("/api/groups/", request)
    }

    fun updateGroup(id: Long, group: GoPhishGroup): GoPhishGroup {
        return put("/api/groups/$id", group)
    }

    fun deleteGroup(id: Long) {
        delete("/api/groups/$id")
    }

    // ==================== TEMPLATES ====================

    fun getTemplates(): List<GoPhishTemplate> {
        return get("/api/templates/")
    }

    fun getTemplate(id: Long): GoPhishTemplate {
        return get("/api/templates/$id")
    }

    fun createTemplate(request: CreateGoPhishTemplateRequest): GoPhishTemplate {
        return post("/api/templates/", request)
    }

    fun updateTemplate(id: Long, template: GoPhishTemplate): GoPhishTemplate {
        return put("/api/templates/$id", template)
    }

    fun deleteTemplate(id: Long) {
        delete("/api/templates/$id")
    }

    // ==================== PAGES ====================

    fun getPages(): List<GoPhishPage> {
        return get("/api/pages/")
    }

    fun getPage(id: Long): GoPhishPage {
        return get("/api/pages/$id")
    }

    fun createPage(request: CreateGoPhishPageRequest): GoPhishPage {
        return post("/api/pages/", request)
    }

    fun updatePage(id: Long, page: GoPhishPage): GoPhishPage {
        return put("/api/pages/$id", page)
    }

    fun deletePage(id: Long) {
        delete("/api/pages/$id")
    }

    // ==================== SMTP ====================

    fun getSMTPProfiles(): List<GoPhishSMTP> {
        return get("/api/smtp/")
    }

    fun getSMTPProfile(id: Long): GoPhishSMTP {
        return get("/api/smtp/$id")
    }

    fun createSMTPProfile(request: CreateGoPhishSMTPRequest): GoPhishSMTP {
        return post("/api/smtp/", request)
    }

    fun updateSMTPProfile(id: Long, smtp: GoPhishSMTP): GoPhishSMTP {
        return put("/api/smtp/$id", smtp)
    }

    fun deleteSMTPProfile(id: Long) {
        delete("/api/smtp/$id")
    }

    // ==================== CAMPAIGNS ====================

    fun getCampaigns(): List<GoPhishCampaign> {
        return get("/api/campaigns/")
    }

    fun getCampaign(id: Long): GoPhishCampaign {
        return get("/api/campaigns/$id")
    }

    fun createCampaign(request: CreateGoPhishCampaignRequest): GoPhishCampaign {
        return post("/api/campaigns/", request)
    }

    fun deleteCampaign(id: Long) {
        delete("/api/campaigns/$id")
    }

    fun getCampaignSummary(id: Long): GoPhishCampaignSummary {
        return get("/api/campaigns/$id/summary")
    }

    fun completeCampaign(id: Long): GoPhishCampaign {
        return get("/api/campaigns/$id/complete")
    }
}