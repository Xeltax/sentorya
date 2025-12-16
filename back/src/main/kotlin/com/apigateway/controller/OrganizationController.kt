package com.apigateway.controller

import com.apigateway.dto.EditOrganizationDTO
import com.apigateway.dto.OrganizationsWithMembersResponse
import com.apigateway.dto.addMemberDTO
import com.apigateway.entity.OrganizationRole
import com.apigateway.entity.Organizations
import com.apigateway.entity.User
import com.apigateway.repository.OrganizationMemberRepository
import com.apigateway.repository.OrganizationRepository
import com.apigateway.repository.UserRepository
import com.apigateway.service.CampaignService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.DeleteMapping
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
    @Autowired
    lateinit var campaignService: CampaignService

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
    fun createOrganization(@RequestBody organization: Organizations): ResponseEntity<OrganizationsWithMembersResponse> {
        val newOrganization = organizationRepository.save(organization)
        val ownerUser = userRepository.findById(newOrganization.ownerId)
            .orElseThrow { Exception("Owner user not found") }

        val ownerAsMember = com.apigateway.entity.OrganizationMember(
            organizationId = newOrganization.id!!,
            userId = ownerUser.id!!,
            role = OrganizationRole.OWNER
        )

        organizationMemberRepository.save(ownerAsMember)

        val response = OrganizationsWithMembersResponse(
            organization = newOrganization,
            members = listOf(ownerUser)
        )

        return ResponseEntity.ok(response)
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun updateOrganization(@RequestBody data: EditOrganizationDTO): ResponseEntity<Organizations> {
        val existingOrganization = organizationRepository.findById(data.id)
            .orElseThrow { Exception("Organization not found") }
        val updatedOrganization = existingOrganization.copy(
            name = data.name,
            email = data.email,
            address = data.address,
            phoneNumber = data.phoneNumber,
        )
        organizationRepository.save(updatedOrganization)
        return ResponseEntity.ok(updatedOrganization)
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteOrganization(@PathVariable id: UUID): ResponseEntity<String> {
        val organization = organizationRepository.findById(id)
            .orElseThrow { Exception("Organization not found") }
        organizationMemberRepository.findByOrganizationId(organization.id!!).forEach { member ->
            organizationMemberRepository.delete(member)
        }
        organizationRepository.delete(organization)

        return ResponseEntity.ok("Organization deleted successfully.")
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

            try {
                campaignService.syncOrganizationCampaigns(organization.id!!)
            } catch (e: Exception) {
                println("Erreur lors de la synchronisation GoPhish: ${e.message}")
            }
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

            try {
                campaignService.syncOrganizationCampaigns(organization.id!!)
            } catch (e: Exception) {
                println("Erreur lors de la synchronisation GoPhish: ${e.message}")
            }
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