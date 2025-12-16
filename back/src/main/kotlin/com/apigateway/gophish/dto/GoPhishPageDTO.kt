package com.apigateway.gophish.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Représente une landing page dans GoPhish
 */
data class GoPhishPage(
    @JsonProperty("id")
    val id: Long? = null,

    @JsonProperty("name")
    val name: String,

    @JsonProperty("html")
    val html: String,

    @JsonProperty("capture_credentials")
    val captureCredentials: Boolean = true,

    @JsonProperty("capture_passwords")
    val capturePasswords: Boolean = true,

    @JsonProperty("redirect_url")
    val redirectUrl: String = "",

    @JsonProperty("modified_date")
    val modifiedDate: String? = null
)

/**
 * Requête pour créer une landing page
 */
data class CreateGoPhishPageRequest(
    @JsonProperty("name")
    val name: String,

    @JsonProperty("html")
    val html: String,

    @JsonProperty("capture_credentials")
    val captureCredentials: Boolean = true,

    @JsonProperty("capture_passwords")
    val capturePasswords: Boolean = true,

    @JsonProperty("redirect_url")
    val redirectUrl: String = ""
)