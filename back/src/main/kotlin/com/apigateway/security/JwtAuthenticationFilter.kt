package com.apigateway.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import mu.KotlinLogging
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

private val logger = KotlinLogging.logger {}

@Component
class JwtAuthenticationFilter(
    private val jwtTokenProvider: JwtTokenProvider
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            val token = getTokenFromRequest(request)

            if (token != null && jwtTokenProvider.validateToken(token)) {
                val email = jwtTokenProvider.getEmailFromToken(token)
                val role = jwtTokenProvider.getRoleFromToken(token)
                val userId = jwtTokenProvider.getUserIdFromToken(token)

                val authorities = listOf(SimpleGrantedAuthority("ROLE_$role"))
                
                val authentication = UsernamePasswordAuthenticationToken(
                    JwtUserPrincipal(userId, email, role),
                    null,
                    authorities
                )

                SecurityContextHolder.getContext().authentication = authentication
                logger.debug { "Authenticated user: $email with role: $role" }
            }
        } catch (ex: Exception) {
            logger.error { "Could not set user authentication: ${ex.message}" }
        }

        filterChain.doFilter(request, response)
    }

    private fun getTokenFromRequest(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
        } else null
    }
}

data class JwtUserPrincipal(
    val userId: String,
    val email: String,
    val role: String
)
