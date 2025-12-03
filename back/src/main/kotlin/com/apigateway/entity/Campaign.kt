package com.apigateway.entity

import jakarta.persistence.*

@Entity
@Table(name = "campaigns")
data class Campaign(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(nullable = false)
    var name: String,

    @Column(name = "campaign_id", unique = true, nullable = false)
    val campaignId: String,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "campaign_users",
        joinColumns = [JoinColumn(name = "campaign_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    val users: MutableSet<User> = mutableSetOf()
) {
    fun addUser(user: User) {
        users.add(user)
        user.campaigns.add(this)
    }

    fun removeUser(user: User) {
        users.remove(user)
        user.campaigns.remove(this)
    }

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
