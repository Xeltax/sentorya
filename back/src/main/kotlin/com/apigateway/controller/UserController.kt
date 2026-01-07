package com.apigateway.controller

import com.apigateway.dto.CreateUserRequest
import com.apigateway.dto.UpdateUserRequest
import com.apigateway.dto.UserResponse
import com.apigateway.entity.Organizations
import com.apigateway.repository.OrganizationMemberRepository
import com.apigateway.repository.OrganizationRepository
import com.apigateway.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService,
    private val organizationRepository: OrganizationRepository,
    private val organizationMemberRepository: OrganizationMemberRepository
) {

    @PostMapping
    fun createUser(@Valid @RequestBody request: CreateUserRequest): ResponseEntity<UserResponse> {
        val user = userService.createUser(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(user)
    }

    @GetMapping
    fun getAllUsers(): ResponseEntity<List<UserResponse>> {
        val users = userService.getAllUsers()
        return ResponseEntity.ok(users)
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: UUID): ResponseEntity<UserResponse> {
        val user = userService.getById(id)
        return ResponseEntity.ok(user)
    }

    @PutMapping
    fun updateUser(@Valid @RequestBody request: UpdateUserRequest): ResponseEntity<UserResponse> {
        val user = userService.updateUser(request)
        return ResponseEntity.ok(user)
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: UUID): ResponseEntity<Unit> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/reset-password/{id}")
    fun resetPassword(@PathVariable id: UUID): ResponseEntity<String> {
        val newPassword = userService.resetPassword(id)
        return ResponseEntity.ok(newPassword)
    }

    @GetMapping("/{userId}/organizations")
    fun getUserOrganization(@PathVariable userId: UUID): ResponseEntity<Any> {
        val members = organizationMemberRepository.findByUserId(userId)
        members.forEach { member ->
            val organization = organizationRepository.findById(member.organizationId).orElse(null)
            if (organization != null) {
                val response = listOf(
                    organization
                )
                return ResponseEntity.ok(response)
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organization not found for user")
    }
}
