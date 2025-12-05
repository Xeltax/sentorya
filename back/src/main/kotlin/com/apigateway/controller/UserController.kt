package com.apigateway.controller

import com.apigateway.dto.CreateUserRequest
import com.apigateway.dto.UpdateUserRequest
import com.apigateway.dto.UserResponse
import com.apigateway.service.UserService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/user")
class UserController(
    private val userService: UserService
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
    fun getUserById(@PathVariable id: String): ResponseEntity<UserResponse> {
        val user = userService.getById(id)
        return ResponseEntity.ok(user)
    }

    @PutMapping
    fun updateUser(@Valid @RequestBody request: UpdateUserRequest): ResponseEntity<UserResponse> {
        val user = userService.updateUser(request)
        return ResponseEntity.ok(user)
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: String): ResponseEntity<Unit> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/reset-password/{id}")
    fun resetPassword(@PathVariable id: UUID): ResponseEntity<String> {
        val newPassword = userService.resetPassword(id)
        return ResponseEntity.ok(newPassword)
    }
}
