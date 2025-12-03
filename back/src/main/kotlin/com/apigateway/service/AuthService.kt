package com.apigateway.service

import com.apigateway.dto.LoginRequest
import com.apigateway.dto.LoginResponse
import com.apigateway.exception.UnauthorizedException
import com.apigateway.repository.UserRepository
import com.apigateway.security.JwtTokenProvider
import mu.KotlinLogging
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

private val logger = KotlinLogging.logger {}

@Service
@Transactional
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider
) {

    fun login(request: LoginRequest): LoginResponse {
        logger.info { "Login attempt for: ${request.email}" }

        val user = userRepository.findByEmail(request.email)
            .orElseThrow { UnauthorizedException("Compte non trouvé") }

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw UnauthorizedException("Mot de passe incorrect")
        }

        // Update first connection and last login
        if (user.firstConnection) {
            user.firstConnection = false
        }
        user.lastLogin = LocalDateTime.now()
        userRepository.save(user)

        val token = jwtTokenProvider.generateToken(
            email = user.email,
            name = user.name,
            role = user.role.name,
            userId = user.id!!
        )

        logger.info { "Login successful for: ${request.email}" }

        return LoginResponse(
            user = user.toResponse(),
            token = token
        )
    }
}
