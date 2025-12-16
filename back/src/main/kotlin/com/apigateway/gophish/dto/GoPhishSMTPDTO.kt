package com.apigateway.gophish.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * Représente un profil SMTP dans GoPhish
 */
data class GoPhishSMTP(
    @JsonProperty("id")
    val id: Long? = null,

    @JsonProperty("name")
    val name: String,

    @JsonProperty("host")
    val host: String? = null,

    @JsonProperty("interface_type")
    val interfaceType: String? = "SMTP",

    @JsonProperty("from_address")
    val fromAddress: String? = null,

    @JsonProperty("ignore_cert_errors")
    val ignoreCertErrors: Boolean? = false,

    @JsonProperty("modified_date")
    val modifiedDate: String? = null
)

/**
 * Requête pour créer un profil SMTP
 */
data class CreateGoPhishSMTPRequest(
    @JsonProperty("name")
    val name: String,

    @JsonProperty("host")
    val host: String,

    @JsonProperty("interface_type")
    val interfaceType: String = "SMTP",

    @JsonProperty("from_address")
    val fromAddress: String,

    @JsonProperty("ignore_cert_errors")
    val ignoreCertErrors: Boolean = false
)