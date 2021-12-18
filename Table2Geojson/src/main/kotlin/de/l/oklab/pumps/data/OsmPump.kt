package de.l.oklab.pumps.data

import com.fasterxml.jackson.annotation.JsonProperty

data class OsmPump(
    val timestamp: String? = null,
    val version: Int? = null,
    val changeset: Long? = null,
    val user: String? = null,
    val uid: Long? = null,
    val historic: String? = null,
    @JsonProperty("man_made")
    val manMade: String? = null,
    val pump: String? = null,
    @JsonProperty("water_well")
    val waterWell: String? = null,
    val id: String? = null
)