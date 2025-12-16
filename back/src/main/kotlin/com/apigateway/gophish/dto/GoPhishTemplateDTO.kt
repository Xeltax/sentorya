package com.apigateway.gophish.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Représente un template d'email dans GoPhish
 */
data class GoPhishTemplate(
    @JsonProperty("id")
    val id: Long? = null,

    @JsonProperty("name")
    val name: String,

    @JsonProperty("subject")
    val subject: String? = null,

    @JsonProperty("text")
    val text: String? = null,

    @JsonProperty("html")
    val html: String? = null,

    @JsonProperty("modified_date")
    val modifiedDate: String? = null,

    @JsonProperty("attachments")
    val attachments: List<GoPhishAttachment>? = emptyList()
)

/**
 * Pièce jointe d'un template
 */
data class GoPhishAttachment(
    @JsonProperty("name")
    val name: String,

    @JsonProperty("content")
    val content: String,

    @JsonProperty("type")
    val type: String
)

/**
 * Requête pour créer un template
 */
data class CreateGoPhishTemplateRequest(
    @JsonProperty("name")
    val name: String,

    @JsonProperty("subject")
    val subject: String,

    @JsonProperty("text")
    val text: String? = null,

    @JsonProperty("html")
    val html: String,

    @JsonProperty("attachments")
    val attachments: List<GoPhishAttachment>? = emptyList()
)