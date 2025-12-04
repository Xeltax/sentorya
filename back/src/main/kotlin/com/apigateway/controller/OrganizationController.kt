package com.apigateway.controller

import com.apigateway.dto.addMemberDTO
import com.apigateway.entity.OrganizationRole
import com.apigateway.entity.Organizations
import com.apigateway.entity.User
import com.apigateway.repository.OrganizationMemberRepository
import com.apigateway.repository.OrganizationRepository
import com.apigateway.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/organizations")
class OrganizationController {

    @Autowired
    lateinit var organizationRepository: OrganizationRepository
    @Autowired
    lateinit var organizationMemberRepository: OrganizationMemberRepository
    @Autowired
    lateinit var userRepository: UserRepository

    @GetMapping("/{id}")
    fun getOrganizationById(@PathVariable id: UUID): ResponseEntity<Organizations> {
        val organization = organizationRepository.findById(id)
            .orElseThrow { Exception("Organization not found") }
        return ResponseEntity.ok(organization)
    }

    @GetMapping("/by-owner/{ownerId}")
    fun getOrganizationByOwnerId(@PathVariable ownerId: UUID): ResponseEntity<Organizations> {
        val organization = organizationRepository.findByOwnerId(ownerId)
            ?: throw Exception("Organization not found for the owner.")
        return ResponseEntity.ok(organization)
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun getAllOrganizations(): ResponseEntity<List<Organizations>> {
        val organizations = organizationRepository.findAll()
        return ResponseEntity.ok(organizations)
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    fun createOrganization(@RequestBody organization: Organizations): ResponseEntity<Organizations> {
        val newOrganization = organizationRepository.save(organization)

        val ownerAsMember = com.apigateway.entity.OrganizationMember(
            organizationId = newOrganization.id!!,
            userId = newOrganization.ownerId,
            role = OrganizationRole.OWNER
        )

        organizationMemberRepository.save(ownerAsMember)

        return ResponseEntity.ok(newOrganization)
    }

    @PutMapping("/add-member")
    fun addMemberToOrganization(
        @RequestBody data : addMemberDTO
    ): ResponseEntity<String> {
        val organization = organizationRepository.findById(data.organizationId)
            .orElseThrow { Exception("Entreprise non trouvé") }

        val existingMember = organizationMemberRepository.findByOrganizationIdAndUserId(
            organization.id!!,
            data.userId
        )

        if (existingMember != null) {
            return ResponseEntity.badRequest().body("L'utilisateur est déjà membre de l'organisation.")
        } else {
            val newMember = com.apigateway.entity.OrganizationMember(
                organizationId = organization.id!!,
                userId = data.userId,
                role = data.role!!
            )
            organizationMemberRepository.save(newMember)
        }

        return ResponseEntity.ok("Membre ajouté avec succès.")
    }

    @PutMapping("/remove-member")
    fun removeMemberFromOrganization(
        @RequestBody data : addMemberDTO
    ): ResponseEntity<String> {
        val organization = organizationRepository.findById(data.organizationId)
            .orElseThrow { Exception("Organization not found") }

        val existingMember = organizationMemberRepository.findByOrganizationIdAndUserId(
            organization.id!!,
            data.userId
        )

        if (existingMember == null) {
            return ResponseEntity.badRequest().body("L'utilisateur n'est pas membre de l'organisation.")
        } else {
            if (existingMember.role == OrganizationRole.OWNER) {
                return ResponseEntity.badRequest().body("Impossible de supprimer le propriétaire de l'organisation.")
            }
            organizationMemberRepository.delete(existingMember)
        }

        return ResponseEntity.ok("Membre supprimé avec succès.")
    }

    @GetMapping("{organizationId}/members")
    fun getOrganizationMembers(
        @PathVariable organizationId: UUID
    ): ResponseEntity<List<User>> {
        val members = organizationMemberRepository.findByOrganizationId(organizationId)
        val usersList = mutableListOf<User>()
        members.forEach { member ->
            val user: User = userRepository.findById(member.userId).orElseThrow { Exception("User not found") }
            usersList.add(user)
        }

        return ResponseEntity.ok(usersList)
    }
}