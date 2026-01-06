package com.apigateway.gophish.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Représente une campagne dans GoPhish
 */
data class GoPhishCampaign(
    @JsonProperty("id")
    val id: Long? = null,

    @JsonProperty("name")
    val name: String,

    @JsonProperty("created_date")
    val createdDate: String? = null,

    @JsonProperty("launch_date")
    val launchDate: String? = null,

    @JsonProperty("send_by_date")
    val sendByDate: String? = null,

    @JsonProperty("completed_date")
    val completedDate: String? = null,

    @JsonProperty("template")
    val template: GoPhishCampaignTemplate,

    @JsonProperty("page")
    val page: GoPhishCampaignPage,

    @JsonProperty("status")
    val status: String? = null,

    @JsonProperty("results")
    val results: List<GoPhishResult>? = emptyList(),

    @JsonProperty("timeline")
    val timeline: List<GoPhishTimelineEvent>? = emptyList(),

    @JsonProperty("smtp")
    val smtp: GoPhishCampaignSMTP,

    @JsonProperty("url")
    val url: String,

    @JsonProperty("groups")
    val groups: List<GoPhishCampaignGroup> = emptyList()
)

/**
 * Template utilisé dans une campagne (référence par nom uniquement)
 */
data class GoPhishCampaignTemplate(
    @JsonProperty("name")
    val name: String
)

/**
 * Page utilisée dans une campagne (référence par nom uniquement)
 */
data class GoPhishCampaignPage(
    @JsonProperty("name")
    val name: String
)

/**
 * SMTP utilisé dans une campagne (référence par nom uniquement)
 */
data class GoPhishCampaignSMTP(
    @JsonProperty("name")
    val name: String
)

/**
 * Groupe utilisé dans une campagne (référence par nom uniquement)
 */
data class GoPhishCampaignGroup(
    @JsonProperty("name")
    val name: String
)

/**
 * Requête pour créer une campagne
 */
data class CreateGoPhishCampaignRequest(
    @JsonProperty("name")
    val name: String,

    @JsonProperty("template")
    val template: GoPhishCampaignTemplate,

    @JsonProperty("page")
    val page: GoPhishCampaignPage,

    @JsonProperty("smtp")
    val smtp: GoPhishCampaignSMTP,

    @JsonProperty("url")
    val url: String,

    @JsonProperty("launch_date")
    val launchDate: String? = null,

    @JsonProperty("send_by_date")
    val sendByDate: String? = null,

    @JsonProperty("groups")
    val groups: List<GoPhishCampaignGroup>
)

/**
 * Résultat d'une campagne
 */
data class GoPhishResult(
    @JsonProperty("id")
    val id: String,

    @JsonProperty("email")
    val email: String,

    @JsonProperty("first_name")
    val firstName: String,

    @JsonProperty("last_name")
    val lastName: String,

    @JsonProperty("position")
    val position: String,

    @JsonProperty("status")
    val status: String,

    @JsonProperty("ip")
    val ip: String,

    @JsonProperty("latitude")
    val latitude: Double,

    @JsonProperty("longitude")
    val longitude: Double,

    @JsonProperty("send_date")
    val sendDate: String,

    @JsonProperty("reported")
    val reported: Boolean
)

/**
 * Événement dans la timeline d'une campagne
 */
data class GoPhishTimelineEvent(
    @JsonProperty("email")
    val email: String,

    @JsonProperty("time")
    val time: String,

    @JsonProperty("message")
    val message: String,

    @JsonProperty("details")
    val details: String? = null
)

/**
 * Résumé d'une campagne
 */
data class GoPhishCampaignSummary(
    @JsonProperty("id")
    val id: Long,

    @JsonProperty("name")
    val name: String,

    @JsonProperty("created_date")
    val createdDate: String,

    @JsonProperty("launch_date")
    val launchDate: String,

    @JsonProperty("completed_date")
    val completedDate: String? = null,

    @JsonProperty("status")
    val status: String,

    @JsonProperty("stats")
    val stats: GoPhishCampaignStats
)

/**
 * Statistiques d'une campagne
 */
data class GoPhishCampaignStats(
    @JsonProperty("total")
    val total: Int,

    @JsonProperty("sent")
    val sent: Int,

    @JsonProperty("opened")
    val opened: Int,

    @JsonProperty("clicked")
    val clicked: Int,

    @JsonProperty("submitted_data")
    val submittedData: Int,

    @JsonProperty("email_reported")
    val emailReported: Int,

    @JsonProperty("error")
    val error: Int
)