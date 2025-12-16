package com.apigateway.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "campaigns")
data class Campaign(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID? = null,

    @Column(nullable = false)
    var name: String,

    @Column(name = "campaign_id", unique = true, nullable = false)
    val campaignId: String,

    val organizationId : UUID,

    @Column(name = "gophish_campaign_id")
    var goPhishCampaignId: Long? = null,

    @Column(name = "gophish_group_id")
    var goPhishGroupId: Long? = null,

    @Column(name = "gophish_template_name")
    var goPhishTemplateName: String? = null,

    @Column(name = "gophish_page_name")
    var goPhishPageName: String? = null,

    @Column(name = "gophish_smtp_name")
    var goPhishSmtpName: String? = null,

    @Column(name = "phishing_url")
    var phishingUrl: String? = null,
) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Campaign) return false
        return id == other.id
    }

    override fun hashCode(): Int = id?.hashCode() ?: 0

    override fun toString(): String {
        return "Campaign(id=$id, name='$name', campaignId='$campaignId')"
    }
}
