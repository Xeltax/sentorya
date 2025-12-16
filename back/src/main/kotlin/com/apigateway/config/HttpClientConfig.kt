package com.apigateway.config

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.web.client.RestTemplate
import java.time.Duration

@Configuration
class HttpClientConfig {

    @Bean
    fun restTemplate(builder: RestTemplateBuilder): RestTemplate {
        return builder
            .requestFactory { settings ->
                SimpleClientHttpRequestFactory().apply {
                    setConnectTimeout(settings.connectTimeout().toMillis().toInt())
                    setReadTimeout(settings.readTimeout().toMillis().toInt())
                }
            }
            .setConnectTimeout(Duration.ofSeconds(30))
            .setReadTimeout(Duration.ofSeconds(30))
            .build()
    }

    @Bean
    fun objectMapper(): ObjectMapper {
        return ObjectMapper().apply {
            registerModule(KotlinModule.Builder().build())
            registerModule(JavaTimeModule())
            configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
        }
    }
}