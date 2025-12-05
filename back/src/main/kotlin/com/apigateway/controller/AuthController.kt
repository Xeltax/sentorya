package com.apigateway.controller

import com.apigateway.dto.LoginRequest
import com.apigateway.dto.LoginResponse
import com.apigateway.dto.changePasswordDTO
import com.apigateway.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }

    @PutMapping("change-password/{userId}")
    fun changePassword(
        @PathVariable userId: UUID,
        @RequestBody data: changePasswordDTO
    ): ResponseEntity<Unit> {
        println("Received new password: ${data.password}")
        authService.changePassword(userId, data.password)
        return ResponseEntity.noContent().build()
    }
}
