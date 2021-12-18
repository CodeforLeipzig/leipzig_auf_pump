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
    val id: String? = null,
    @JsonProperty("drinking_water")
    val drinkingWater: String? = null,
    @JsonProperty("drinking_water:legal")
    val drinkingWaterLegal: String? = null,
    @JsonProperty("pump:style")
    val pumpStyle: String? = null,
    val heritage: String? = null,
    @JsonProperty("heritage:operator")
    val heritageOperator: String? = null,
    val photo: String? = null,
    val image: String? = null,
    @JsonProperty("ref:lfd")
    val sequentialId: String? = null,
    @JsonProperty("removed:man_made")
    val removedManMade: String? = null,
    @JsonProperty("pump:status")
    val pumpStatus: String? = null,
    val disused: String? = null,
    val access: String? = null,
    val description: String? = null,
    @JsonProperty("lfd:criteria")
    val sequentialCriteria: String? = null,
    val name: String? = null,
    @JsonProperty("start_date")
    val startDate: String? = null,
)