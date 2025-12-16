package com.apigateway.gophish.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class GoPhishTarget(
    @JsonProperty("email")
    val email: String,

    @JsonProperty("first_name")
    val firstName: String,

    @JsonProperty("last_name")
    val lastName: String,

    @JsonProperty("position")
    val position: String = ""
)