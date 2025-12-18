package com.apigateway.gophish.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

/**
 * Configuration pour l'intégration GoPhish
 */
@Configuration
@ConfigurationProperties(prefix = "gophish")
data class GoPhishConfig(
    /**
     * URL de l'instance GoPhish (ex: https://gophish.example.com)
     */
    var apiUrl: String = "http://127.0.0.1:3333",

    /**
     * Clé API GoPhish
     */
    var apiKey: String = "b4ed4709881d80ccc1f3046600cf48145a1e6129abefaf88b2b0615b78dd29bf",

    /**
     * Timeout pour les requêtes HTTP en millisecondes
     */
    var timeoutMs: Long = 30000,

    /**
     * Nombre de tentatives en cas d'échec
     */
    var retryAttempts: Int = 3,

    /**
     * Délai entre les tentatives en millisecondes
     */
    var retryDelayMs: Long = 1000,

    /**
     * Activer/désactiver la vérification SSL (pour dev uniquement)
     */
    var verifySsl: Boolean = false
)