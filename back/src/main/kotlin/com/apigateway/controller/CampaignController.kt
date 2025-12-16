package com.apigateway.controller

import com.apigateway.dto.*
import com.apigateway.service.CampaignService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/campaign")
class CampaignController(
    private val campaignService: CampaignService
) {

    @PostMapping
    fun createCampaign(@Valid @RequestBody request: CreateCampaignRequest): ResponseEntity<CampaignResponse> {
        val campaign = campaignService.createCampaign(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(campaign)
    }

    @GetMapping
    fun getAllCampaigns(): ResponseEntity<List<CampaignResponse>> {
        val campaigns = campaignService.getAllCampaigns()
        return ResponseEntity.ok(campaigns)
    }

    @GetMapping("/{id}")
    fun getCampaignById(@PathVariable id: UUID): ResponseEntity<CampaignResponse> {
        val campaign = campaignService.getById(id)
        return ResponseEntity.ok(campaign)
    }

    @GetMapping("/byCampain/{campaignId}")
    fun getCampaignByCampaignId(@PathVariable campaignId: String): ResponseEntity<CampaignResponse> {
        val campaign = campaignService.getByCampaignId(campaignId)
        return ResponseEntity.ok(campaign)
    }

    @PutMapping("/{id}")
    fun updateCampaign(
        @PathVariable id: String,
        @Valid @RequestBody request: UpdateCampaignRequest
    ): ResponseEntity<CampaignResponse> {
        val campaign = campaignService.updateCampaign(id, request)
        return ResponseEntity.ok(campaign)
    }

    @DeleteMapping("/{id}")
    fun deleteCampaign(@PathVariable id: UUID): ResponseEntity<Unit> {
        campaignService.deleteCampaign(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/{id}/results")
    fun getCampaignResults(@PathVariable id: UUID): ResponseEntity<Any> {
        val results = campaignService.getCampaignResults(id)
        return ResponseEntity.ok(results)
    }
}