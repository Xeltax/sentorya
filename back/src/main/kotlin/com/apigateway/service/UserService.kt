package com.apigateway.service

import com.apigateway.dto.*
import com.apigateway.entity.User
import com.apigateway.exception.ConflictException
import com.apigateway.exception.ResourceNotFoundException
import com.apigateway.repository.UserRepository
import mu.KotlinLogging
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

private val logger = KotlinLogging.logger {}

@Service
@Transactional
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun createUser(request: CreateUserRequest): UserResponse {
        logger.info { "Creating user with email: ${request.email}" }

        if (userRepository.existsByEmail(request.email)) {
            throw ConflictException("User already exists")
        }

        val user = User(
            email = request.email,
            name = request.name,
            phoneNumber = request.phoneNumber,
            password = passwordEncoder.encode(request.password),
            role = request.role
        )

        val savedUser = userRepository.save(user)
        return savedUser.toResponse()
    }

    @Transactional(readOnly = true)
    fun getById(id: UUID): UserResponse {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found") }
        return user.toResponse()
    }

    @Transactional(readOnly = true)
    fun getByEmail(email: String): User? {
        return userRepository.findByEmail(email).orElse(null)
    }

    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserResponse> {
        return userRepository.findAll().map { it.toResponse() }
    }

    fun updateUser(request: UpdateUserRequest): UserResponse {
        val user = userRepository.findById(request.id)
            .orElseThrow { ResourceNotFoundException("User not found") }

        request.name?.let { user.name = it }
        request.phoneNumber?.let { user.phoneNumber = it }
        request.password?.let { user.password = passwordEncoder.encode(it) }
        request.role?.let { user.role = it }
        request.isActive?.let { user.isActive = it }

        val updatedUser = userRepository.save(user)
        return updatedUser.toResponse()
    }

    @Transactional(readOnly = true)
    fun resetPassword(id: UUID) : String {
        val user = userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found") }

        val password = generatePassword()
        user.password = passwordEncoder.encode(password)
        userRepository.save(user)

        return password
    }

    fun deleteUser(id: UUID) {
        if (!userRepository.existsById(id.toString())) {
            throw ResourceNotFoundException("User not found")
        }
        userRepository.deleteById(id.toString())
        logger.info { "User deleted: $id" }
    }

    fun findById(id: String): User {
        return userRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("User not found") }
    }

    fun generatePassword(): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&*()-_=+"
        return (1..12)
            .map { chars.random() }
            .joinToString("")
    }
}

fun User.toResponse() = UserResponse(
    id = this.id!!,
    email = this.email,
    name = this.name,
    phoneNumber = this.phoneNumber,
    firstConnection = this.firstConnection,
    role = this.role,
    isActive = this.isActive,
    createdAt = this.createdAt?.toString(),
    lastLogin = this.lastLogin?.toString(),
    updatedAt = this.updatedAt?.toString()
)
