package com.apigateway.dto

import com.apigateway.entity.OrganizationRole
import com.apigateway.entity.Role
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.util.UUID

// ===== Auth DTOs =====
data class LoginRequest(
    @field:Email(message = "Email invalide")
    @field:NotBlank(message = "L'email est requis")
    val email: String,

    @field:NotBlank(message = "Le mot de passe est requis")
    val password: String
)

data class LoginResponse(
    val user: UserResponse,
    val token: String
)

// ===== User DTOs =====
data class CreateUserRequest(
    @field:Email(message = "Email invalide")
    @field:NotBlank(message = "L'email est requis")
    val email: String,

    @field:NotBlank(message = "Le nom est requis")
    val name: String,

    val phoneNumber: String? = null,

    @field:NotBlank(message = "Le mot de passe est requis")
    @field:Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    val password: String,

    val role: Role = Role.USER
)

data class UpdateUserRequest(
    val id: String,
    val name: String? = null,
    val phoneNumber: String? = null,
    val password: String? = null,
    val role: Role? = null,
    val isActive: Boolean? = null
)

data class UserResponse(
    val id: UUID,
    val email: String,
    val name: String,
    val phoneNumber: String?,
    val firstConnection: Boolean,
    val role: Role,
    val isActive: Boolean,
    val createdAt: String?,
    val lastLogin: String?,
    val updatedAt: String?
)

// ===== Campaign DTOs =====
data class CreateCampaignRequest(
    @field:NotBlank(message = "Le nom est requis")
    val name: String,

    @field:NotBlank(message = "L'ID de campagne est requis")
    val campaignId: String
)

data class UpdateCampaignRequest(
    val name: String? = null,
    val campaignId: String? = null
)

data class CampaignUserRequest(
    @field:NotBlank(message = "L'ID de campagne est requis")
    val campaignId: String,

    @field:NotBlank(message = "L'ID utilisateur est requis")
    val userId: String
)

data class CampaignResponse(
    val id: String,
    val name: String,
    val campaignId: String,
    val users: List<UserResponse>
)

data class addMemberDTO(
    val organizationId: UUID,
    val userId: UUID,
    val role: OrganizationRole? = OrganizationRole.MEMBER
)