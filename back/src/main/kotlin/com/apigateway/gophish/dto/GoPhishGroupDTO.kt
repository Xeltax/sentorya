package com.apigateway.gophish.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDateTime

/**
 * Représente un groupe dans GoPhish
 */
data class GoPhishGroup(
    @JsonProperty("id")
    val id: Long? = null,

    @JsonProperty("name")
    var name: String,

    @JsonProperty("targets")
    val targets: List<GoPhishTarget>,

    @JsonProperty("modified_date")
    val modifiedDate: String? = null
)

/**
 * Requête pour créer un groupe
 */
data class CreateGoPhishGroupRequest(
    @JsonProperty("name")
    val name: String,

    @JsonProperty("targets")
    val targets: List<GoPhishTarget>
)

/**
 * Résumé d'un groupe (sans la liste complète des targets)
 */
data class GoPhishGroupSummary(
    @JsonProperty("id")
    val id: Long,

    @JsonProperty("name")
    val name: String,

    @JsonProperty("modified_date")
    val modifiedDate: String,

    @JsonProperty("num_targets")
    val numTargets: Int
)