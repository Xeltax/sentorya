package com.apigateway.gophish.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Réponse d'erreur de l'API GoPhish
 */
data class GoPhishErrorResponse(
    @JsonProperty("message")
    val message: String,

    @JsonProperty("success")
    val success: Boolean = false,

    @JsonProperty("data")
    val data: Any? = null
)

/**
 * Réponse de succès générique de l'API GoPhish
 */
data class GoPhishSuccessResponse(
    @JsonProperty("message")
    val message: String,

    @JsonProperty("success")
    val success: Boolean = true,

    @JsonProperty("data")
    val data: Any? = null
)