package com.apigateway.controller

import com.apigateway.gophish.dto.*
import com.apigateway.gophish.service.GoPhishService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

/**
 * Controller pour les opérations GoPhish spécifiques
 */
@RestController
@RequestMapping("/gophish")
@PreAuthorize("hasRole('ADMIN')")
class GoPhishController(
    private val goPhishService: GoPhishService
) {

    // ==================== TEMPLATES ====================

    @GetMapping("/templates")
    fun listTemplates(): ResponseEntity<List<GoPhishTemplate>> {
        val templates = goPhishService.getAllTemplates()
        return ResponseEntity.ok(templates)
    }

    @PostMapping("/templates")
    fun createTemplate(@RequestBody request: CreateGoPhishTemplateRequest): ResponseEntity<GoPhishTemplate> {
        val template = goPhishService.createTemplate(request)
        return ResponseEntity.ok(template)
    }

    // ==================== PAGES ====================

    @GetMapping("/pages")
    fun listPages(): ResponseEntity<List<GoPhishPage>> {
        val pages = goPhishService.getAllPages()
        return ResponseEntity.ok(pages)
    }

    @PostMapping("/pages")
    fun createPage(@RequestBody request: CreateGoPhishPageRequest): ResponseEntity<GoPhishPage> {
        val page = goPhishService.createPage(request)
        return ResponseEntity.ok(page)
    }

    // ==================== SMTP PROFILES ====================

    @GetMapping("/smtp")
    fun listSMTPProfiles(): ResponseEntity<List<GoPhishSMTP>> {
        val profiles = goPhishService.getAllSMTPProfiles()
        return ResponseEntity.ok(profiles)
    }

    // ==================== GROUPS ====================

    @GetMapping("/groups")
    fun listGroups(): ResponseEntity<List<GoPhishGroup>> {
        val groups = goPhishService.getAllGroups()
        return ResponseEntity.ok(groups)
    }

    @GetMapping("/groups/{id}")
    fun getGroup(@PathVariable id: Long): ResponseEntity<GoPhishGroup> {
        val group = goPhishService.getGroup(id)
        return ResponseEntity.ok(group)
    }

    @DeleteMapping("/groups/{id}")
    fun deleteGroup(@PathVariable id: Long): ResponseEntity<Unit> {
        goPhishService.deleteGroup(id)
        return ResponseEntity.noContent().build()
    }

    // ==================== CAMPAIGNS ====================

    @GetMapping("/campaigns")
    fun listCampaigns(): ResponseEntity<List<GoPhishCampaign>> {
        val campaigns = goPhishService.getAllCampaigns()
        return ResponseEntity.ok(campaigns)
    }

    @GetMapping("/campaigns/{id}")
    fun getCampaign(@PathVariable id: Long): ResponseEntity<GoPhishCampaign> {
        val campaign = goPhishService.getCampaign(id)
        return ResponseEntity.ok(campaign)
    }

    @GetMapping("/campaigns/{id}/summary")
    fun getCampaignSummary(@PathVariable id: Long): ResponseEntity<GoPhishCampaignSummary> {
        val summary = goPhishService.getCampaignSummary(id)
        return ResponseEntity.ok(summary)
    }

    @PostMapping("/campaigns/{id}/complete")
    fun completeCampaign(@PathVariable id: Long): ResponseEntity<GoPhishCampaign> {
        val campaign = goPhishService.completeCampaign(id)
        return ResponseEntity.ok(campaign)
    }

    @DeleteMapping("/campaigns/{id}")
    fun deleteCampaign(@PathVariable id: Long): ResponseEntity<Unit> {
        goPhishService.deleteCampaign(id)
        return ResponseEntity.noContent().build()
    }
}