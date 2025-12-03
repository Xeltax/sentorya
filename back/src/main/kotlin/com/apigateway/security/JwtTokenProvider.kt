package com.apigateway.security

import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import mu.KotlinLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

private val logger = KotlinLogging.logger {}

@Component
class JwtTokenProvider(
    @Value("\${jwt.secret}") private val jwtSecret: String,
    @Value("\${jwt.expiration}") private val jwtExpiration: Long
) {
    private val secretKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(jwtSecret.toByteArray())
    }

    fun generateToken(
        email: String,
        name: String,
        role: String,
        userId: UUID
    ): String {
        val now = Date()
        val expiryDate = Date(now.time + jwtExpiration)

        return Jwts.builder()
            .subject(email)
            .claim("email", email)
            .claim("name", name)
            .claim("role", role)
            .claim("userId", userId)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(secretKey)
            .compact()
    }

    fun getEmailFromToken(token: String): String {
        return getClaims(token).subject
    }

    fun getUserIdFromToken(token: String): String {
        return getClaims(token)["userId"] as String
    }

    fun getRoleFromToken(token: String): String {
        return getClaims(token)["role"] as String
    }

    fun validateToken(token: String): Boolean {
        return try {
            getClaims(token)
            true
        } catch (ex: JwtException) {
            logger.error { "Invalid JWT token: ${ex.message}" }
            false
        } catch (ex: IllegalArgumentException) {
            logger.error { "JWT claims string is empty: ${ex.message}" }
            false
        }
    }

    private fun getClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}
